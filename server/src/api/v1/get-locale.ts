import { RequestHandler } from '../../types';
import { APPLICATION_JSON } from '../../utils/constants';
import { Locale } from '../../types/interfaces';
import { getLocale } from '../../utils/lib';

const getLocaleHandler: RequestHandler<
  { Querystring: { field: keyof Locale['app'] } },
  any
> = async ({ query, headers }, reply) => {
  const { 'accept-language': lang } = headers;

  const locale = (await getLocale(lang)).app;
  const { field } = query;

  reply.type(APPLICATION_JSON).code(200);
  return locale[field];
};

export default getLocaleHandler;
