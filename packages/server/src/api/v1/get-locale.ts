import { RequestHandler } from '../../types';
import { Locale, Result, APPLICATION_JSON } from '../../types/interfaces';
import getLocale from '../../utils/getLocale';
import { parseHeaders } from '../../utils/lib';

const getLocaleHandler: RequestHandler<
  { Querystring: { field: keyof Locale['app'] } },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Result<any>
> = async ({ query, headers }, reply) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).app;

  const { field } = query;

  reply.type(APPLICATION_JSON).code(200);
  return {
    status: 'info',
    message: '',
    code: 200,
    data: locale[field] || null,
  };
};

export default getLocaleHandler;
