import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseFindManyQuery,
  PhraseFindManyResult,
  Result,
  SEARCH_MIN_LENGTH,
  firstCapitalize,
} from '../../../types/interfaces';
import { getLocale, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseFindMany: RequestHandler<
  { Querystring: PhraseFindManyQuery },
  Result<PhraseFindManyResult>
> = async ({ headers, query }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;
  const {
    orderBy,
    skip: _skip,
    take: _take,
    tags: _tags,
    strongTags: _strongTags,
    search: _search,
  } = query;

  const skip = _skip ? parseInt(_skip, 10) : undefined;
  const take = _skip ? parseInt(_take, 10) : undefined;
  let tags: string[] = [];
  if (_tags) {
    tags = _tags.split(',');
  }

  const strongTags = _strongTags === '1';
  const tagsFilter = strongTags ? 'AND' : 'OR';
  const search =
    _search?.length >= SEARCH_MIN_LENGTH ? _search.replace(/[\s\n\t]/g, ' | ') : undefined;

  const res = await orm.phraseFindMany({
    where: {
      AND: [
        { userId: id },
        {
          [tagsFilter]: tags.map((item) => ({
            PhraseTag: {
              some: {
                tagId: item,
              },
            },
          })),
        },
        {
          OR: [
            {
              text: {
                search,
              },
            },
            {
              text: {
                contains: search,
              },
            },
            {
              text: {
                contains: search ? firstCapitalize(search) : undefined,
              },
            },
            {
              text: {
                contains: search?.toUpperCase(),
              },
            },
            {
              text: {
                contains: search?.toLowerCase(),
              },
            },
            {
              translate: {
                search,
              },
            },
            {
              translate: {
                contains: search,
              },
            },
            {
              translate: {
                contains: search ? firstCapitalize(search) : undefined,
              },
            },
            {
              translate: {
                contains: search?.toUpperCase(),
              },
            },
            {
              translate: {
                contains: search?.toLowerCase(),
              },
            },
          ],
        },
      ],
      NOT: strongTags
        ? tags.map(() => ({
            PhraseTag: {
              some: {
                tagId: {
                  notIn: tags,
                },
              },
            },
          }))
        : undefined,
    },
    include: {
      PhraseTag: {
        include: {
          Tag: {
            include: {
              PhraseTag: {
                select: {
                  phraseId: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      updated: orderBy,
    },
    skip,
    take,
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

  return {
    status: 'info',
    message: locale.success,
    data: res.data,
    count: res.count,
    skip: res.skip,
    take: res.take,
  };
};

export default phraseFindMany;
