import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  CheckEmailQuery,
  CheckEmailResult,
  Result,
  checkEmail,
} from '../../../types/interfaces';
import { getLocale, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkEmailHandler: RequestHandler<
  { Querystring: CheckEmailQuery },
  Result<CheckEmailResult>
> = async ({ headers, query }, reply) => {
  const { lang } = parseHeaders(headers);
  const { email } = query;

  const locale = getLocale(lang).server;

  if (!checkEmail(email)) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      status: 'warn',
      message: locale.badRequest,
      data: false,
    };
  }
  const user = await orm.userFindFirst({
    where: {
      email,
    },
  });
  if (user.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: false,
    };
  }

  reply.type(APPLICATION_JSON).code(200);
  return {
    status: 'info',
    message: locale.success,
    data: true,
  };
};

export default checkEmailHandler;
