import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  checkEmail,
  UserCleanResult,
  UserUpdateBody,
} from '../../../types/interfaces';
import { getHttpCode, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { createPasswordHash, createRandomSalt } from '../../../utils/auth';
import { cleanUserFields } from '../../../components/lib';
import getLocale from '../../../utils/getLocale';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userUpdate: RequestHandler<{ Body: UserUpdateBody }, Result<UserCleanResult | null>> = async (
  { headers, body },
  reply
) => {
  const { lang, id } = parseHeaders(headers);
  const { email, password, name, userId } = body;

  const locale = getLocale(lang).server;

  if ((email && !checkEmail(email)) || userId !== id) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      status: 'warn',
      message: locale.badRequest,
      data: null,
    };
  }

  let user = await orm.userFindFirst({
    where: {
      id,
    },
  });
  if (user.status !== 'info' || !user.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(user.status));
    return {
      status: user.status,
      data: null,
      message: user.status === 'error' ? locale.error : locale.notFound,
    };
  }

  const hash = password?.oldPassword
    ? createPasswordHash({ password: password.oldPassword, salt: user.data.salt })
    : undefined;
  if (password?.newPassword && hash !== user.data.password) {
    reply.type(APPLICATION_JSON).code(401);
    return {
      status: 'warn',
      data: null,
      code: 401,
      message: locale.wrongPassword,
    };
  }

  const salt = createRandomSalt();
  const _hash = password?.oldPassword
    ? createPasswordHash({ password: password.newPassword, salt })
    : undefined;
  user = await orm.userUpdate({
    where: { id },
    data: {
      name,
      email,
      password: password?.newPassword ? _hash : undefined,
      salt: password?.newPassword ? salt : undefined,
      updated: new Date(),
      confirm: email && user.data.email !== email ? false : undefined,
      lang,
    },
  });

  const cleanData = cleanUserFields(user.data);

  reply.type(APPLICATION_JSON).code(201);
  return {
    status: 'info',
    message: locale.success,
    data: cleanData,
  };
};

export default userUpdate;
