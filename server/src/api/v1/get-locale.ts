import { RequestHandler } from '../../types';
import { APPLICATION_JSON } from '../../utils/constants';
import { Locale } from '../../types/interfaces';
import { getLang, getLocale } from '../../utils/lib';

const getLocaleHandler: RequestHandler<
  { Querystring: { field: keyof Locale['app'] } },
  any
> = async ({ query, headers }, reply) => {
  const lang = getLang(headers);
  const locale = getLocale(lang).app;

  const { field } = query;

  reply.type(APPLICATION_JSON).code(200);
  return locale[field];
};

export default getLocaleHandler;
