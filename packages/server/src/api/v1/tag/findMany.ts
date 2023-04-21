import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  TagFindManyQuery,
  TagFindManyResult,
} from '../../../types/interfaces';
import { getLocale, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const tagFindMany: RequestHandler<
  { Querystring: TagFindManyQuery },
  Result<TagFindManyResult>
> = async ({ headers }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const tags = await orm.tagFindMany({
    where: {
      userId: id,
    },
    include: {
      PhraseTag: {
        select: {
          phraseId: true,
        },
      },
    },
  });
  if (tags.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: [],
    };
  }

  reply.type(APPLICATION_JSON).code(200);

  return { status: 'info', message: locale.tagSaved, data: tags.data };
};

export default tagFindMany;
