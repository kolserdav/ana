import { RequestHandler } from '../../../types';
import { APPLICATION_JSON, UserCleanResult, Result } from '../../../types/interfaces';
import { getHttpCode, getLocale, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { cleanUserFields } from '../../../components/lib';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userFindFirst: RequestHandler<
  { Querystring: { id: string } },
  Result<UserCleanResult | null>
> = async ({ headers }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const user = await orm.userFindFirst({ where: { id } });
  const locale = getLocale(lang).server;

  if (user.data === null) {
    reply.type(APPLICATION_JSON).code(getHttpCode(user.status));
    return {
      status: 'error',
      data: null,
      message: user.status === 'error' ? locale.error : locale.notFound,
    };
  }

  const cleanData = cleanUserFields(user.data);
  if (cleanData === null) {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      data: null,
      message: user.status === 'error' ? locale.error : locale.notFound,
    };
  }

  reply.type(APPLICATION_JSON).code(200);
  return {
    status: 'info',
    data: cleanData,
    message: locale.success,
  };
};

export default userFindFirst;
