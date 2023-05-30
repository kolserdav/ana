import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseFindByTextQuery,
  PhraseFindByTextResult,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { getHttpCode, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseFindByText: RequestHandler<
  { Querystring: PhraseFindByTextQuery },
  Result<PhraseFindByTextResult>
> = async ({ headers, query }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const { text } = query;
  const locale = getLocale(lang).server;

  const res = await orm.phraseFindFirst({
    where: {
      AND: [{ text }, { userId: id }],
    },
    select: {
      id: true,
    },
  });
  if (res.status !== 'info') {
    reply.type(APPLICATION_JSON).code(getHttpCode(res.status));
    return {
      status: res.status,
      message: res.status === 'error' ? locale.error : locale.notFound,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(200);

  return { status: 'info', message: locale.success, data: res.data };
};

export default phraseFindByText;
