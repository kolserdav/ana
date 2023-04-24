import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  UserLoginBody,
  checkEmail,
  UserLoginResult,
} from '../../../types/interfaces';
import { getHttpCode, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { createPasswordHash, createToken } from '../../../utils/auth';
import getLocale from '../../../utils/getLocale';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userLogin: RequestHandler<{ Body: UserLoginBody }, Result<UserLoginResult | null>> = async (
  { headers, body },
  reply
) => {
  const { lang } = parseHeaders(headers);
  const { email, password } = body;

  const locale = getLocale(lang).server;
  if (!checkEmail(email)) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      status: 'warn',
      message: locale.badRequest,
      data: null,
    };
  }

  const user = await orm.userFindFirst({
    where: {
      email,
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

  const hash = createPasswordHash({ password, salt: user.data.salt });
  if (hash !== user.data.password) {
    reply.type(APPLICATION_JSON).code(401);
    return {
      status: 'warn',
      data: null,
      message: locale.wrongPassword,
    };
  }

  const token = createToken({
    id: user.data.id,
    password: user.data.password,
  });

  if (!token) {
    reply.type(APPLICATION_JSON).code(502);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(200);
  return {
    status: 'info',
    message: '',
    data: { token, userId: user.data.id },
  };
};

export default userLogin;
