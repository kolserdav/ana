import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseFindManyQuery,
  PhraseFindManyResult,
  PhraseFindManyResultLight,
  QUERY_STRING_ARRAY_SPLITTER,
  Result,
  SEARCH_MIN_LENGTH,
  UNDEFINED_QUERY_STRING,
  firstCapitalize,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseFindMany: RequestHandler<
  { Querystring: PhraseFindManyQuery },
  Result<
    PhraseFindManyQuery['light'] extends '1' ? PhraseFindManyResultLight : PhraseFindManyResult
  >
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
    gt: _gt,
    learnLang: _learnLang,
    isTrash: _isTrash,
    light: _light,
  } = query;

  const skip = _skip ? parseInt(_skip, 10) : undefined;
  const take = _skip ? parseInt(_take, 10) : undefined;
  const learnLang = _learnLang && _learnLang !== UNDEFINED_QUERY_STRING ? _learnLang : undefined;
  let tags: string[] = [];
  if (_tags) {
    tags = _tags.split(QUERY_STRING_ARRAY_SPLITTER);
  }
  let gt: Date | undefined = new Date(_gt);
  if (Number.isNaN(gt.getTime())) {
    gt = undefined;
  }
  const light = _light === '1';
  const strongTags = _strongTags === '1';
  const isTrash = _isTrash === '1';
  const tagsFilter = strongTags ? 'AND' : 'OR';
  const search =
    _search?.length >= SEARCH_MIN_LENGTH ? _search.replace(/[\s\n\t]/g, ' | ') : undefined;

  const select: any = 'select';

  const res = await orm.phraseFindMany({
    where: {
      AND: [
        { userId: id },
        { deleted: isTrash },
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
        {
          updated: {
            gt,
          },
        },
        {
          learnLang,
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
    include: light
      ? undefined
      : {
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
    [select]: light
      ? {
          id: true,
        }
      : undefined,
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

  let data: any = res.data;
  if (light) {
    data = res.data.map((item) => item.id);
  }

  return {
    status: 'info',
    message: locale.success,
    data,
    count: res.count,
    skip: res.skip,
    take: res.take,
  };
};

export default phraseFindMany;
