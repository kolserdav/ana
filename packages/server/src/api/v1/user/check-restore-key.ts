import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  CheckRestoreKeyQuery,
  CheckRestoreKeyResult,
  Result,
  checkEmail,
} from '../../../types/interfaces';
import { getHttpCode, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { differenceInHours } from 'date-fns';
import { RESTORE_LINK_TIMEOUT_IN_HOURS } from '../../../utils/constants';
import getLocale from '../../../utils/getLocale';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkRestoreKey: RequestHandler<
  { Querystring: CheckRestoreKeyQuery },
  Result<CheckRestoreKeyResult | null>
> = async ({ headers, query }, reply) => {
  const { lang } = parseHeaders(headers);
  const { email, key } = query;

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
      status: user.status,
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
  const { created } = user.data.RestoreLink[0];
  const diffsInHours = differenceInHours(new Date(), new Date(created));
  if (diffsInHours >= RESTORE_LINK_TIMEOUT_IN_HOURS) {
    reply.type(APPLICATION_JSON).code(408);
    return {
      status: 'warn',
      message: locale.linkExpired,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(200);
  return {
    status: 'info',
    message: locale.success,
    data: true,
  };
};

export default checkRestoreKey;
