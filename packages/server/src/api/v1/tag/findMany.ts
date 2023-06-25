import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  TagFindManyQuery,
  TagFindManyResult,
  UNDEFINED_QUERY_STRING,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const tagFindMany: RequestHandler<
  { Querystring: TagFindManyQuery },
  Result<TagFindManyResult>
> = async ({ headers, query }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { deleted: _deleted } = query;
  const deleted = _deleted === (UNDEFINED_QUERY_STRING as any) ? undefined : _deleted === '1';

  console.log(_deleted);
  const tags = await orm.tagFindMany({
    where: {
      AND: [
        { userId: id },
        {
          PhraseTag:
            deleted !== undefined
              ? {
                  some: {
                    Phrase: {
                      deleted,
                    },
                  },
                }
              : undefined,
        },
      ],
    },
    include: {
      PhraseTag: {
        where:
          deleted !== undefined
            ? {
                Phrase: {
                  deleted,
                },
              }
            : undefined,
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

  return {
    status: 'info',
    message: locale.success,
    data: tags.data.sort((itemA, itemB) => {
      return itemA.text.localeCompare(itemB.text);
    }),
  };
};

export default tagFindMany;
