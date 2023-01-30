import { RequestHandler } from '../../types';
import { APPLICATION_JSON } from '../../utils/constants';
import { Locale, Result } from '../../types/interfaces';
import { parseHeaders, getLocale } from '../../utils/lib';

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
    status: 'success',
    message: '',
    code: 200,
    data: locale[field],
  };
};

export default getLocaleHandler;
