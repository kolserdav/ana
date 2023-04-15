import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  checkEmail,
  RestorePasswordBody,
  RestorePasswordResult,
} from '../../../types/interfaces';
import { getHttpCode, getLocale, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { createPasswordHash, createRandomSalt } from '../../../utils/auth';
import { differenceInHours } from 'date-fns';
import { RESTORE_LINK_TIMEOUT_IN_HOURS } from '../../../utils/constants';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const restorePassword: RequestHandler<
  { Body: RestorePasswordBody },
  Result<RestorePasswordResult | null>
> = async ({ headers, body }, reply) => {
  const { lang } = parseHeaders(headers);
  const { email, password, key } = body;

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
    where: { email },
    include: {
      RestoreLink: {
        where: {
          id: key,
        },
      },
    },
  });
  if (user.status !== 'info' || !user.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(user.status));
    return {
      status: 'warn',
      message: user.status === 'error' ? locale.error : locale.notFound,
      data: null,
    };
  }
  if (!user.data.RestoreLink[0]) {
    reply.type(APPLICATION_JSON).code(404);
    return {
      status: 'warn',
      message: locale.linkUnaccepted,
      data: null,
    };
  }
  const { created, id: restoreLinkId } = user.data.RestoreLink[0];
  const diffsInHours = differenceInHours(new Date(), new Date(created));
  if (diffsInHours >= RESTORE_LINK_TIMEOUT_IN_HOURS) {
    reply.type(APPLICATION_JSON).code(408);
    return {
      status: 'warn',
      message: locale.linkExpired,
      data: null,
    };
  }

  const salt = createRandomSalt();
  const hash = createPasswordHash({ password, salt });

  const res = await orm.userUpdate({
    where: {
      id: user.data.id,
    },
    data: {
      salt,
      password: hash,
      updated: new Date(),
      RestoreLink: {
        delete: {
          id: restoreLinkId,
        },
      },
    },
  });

  if (res.status !== 'info') {
    reply.type(APPLICATION_JSON).code(getHttpCode(res.status));
    return {
      status: res.status,
      message: res.message,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(201);
  return {
    status: 'info',
    message: '',
    data: null,
  };
};

export default restorePassword;
