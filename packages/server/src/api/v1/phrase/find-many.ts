import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseFindManyQuery,
  PhraseFindManyResult,
  Result,
} from '../../../types/interfaces';
import { getLocale, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseFindMany: RequestHandler<
  { Querystring: PhraseFindManyQuery },
  Result<PhraseFindManyResult>
> = async ({ headers, query }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;
  const { orderBy } = query;

  const res = await orm.phraseFindMany({
    where: {
      userId: id,
    },
    include: {
      PhraseTag: {
        include: {
          Tag: true,
        },
      },
    },
    orderBy: {
      updated: orderBy,
    },
  });
  if (res.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: [],
    };
  }

  reply.type(APPLICATION_JSON).code(200);

  return { status: 'info', message: locale.tagSaved, data: res.data };
};

export default phraseFindMany;
