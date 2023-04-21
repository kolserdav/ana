import { Prisma, PrismaClient } from '@prisma/client';
import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseFindManyQuery,
  PhraseFindManyResult,
  Result,
} from '../../../types/interfaces';
import { getLocale, parseHeaders } from '../../../utils/lib';

const prisma = new PrismaClient();

prisma.phrase.findMany({
  orderBy: {
    updated: undefined,
  },
});

const orm = new ORM();

const phraseFindMany: RequestHandler<
  { Querystring: PhraseFindManyQuery },
  Result<PhraseFindManyResult>
> = async ({ headers, query }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;
  const { orderBy, skip: _skip, take: _take, tags: _tags, strongTags } = query;

  const skip = _skip ? parseInt(_skip, 10) : undefined;
  const take = _skip ? parseInt(_take, 10) : undefined;
  let tags: string[] = [];
  if (_tags) {
    tags = _tags.split(',');
  }

  const tagsFilter = strongTags === '1' ? 'AND' : 'OR';

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
      ],
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

  let strong = false;
  res.data.every((item) => {
    tags.every((_item) => {
      if (item.PhraseTag.find((__item) => __item.Tag.id === _item)) {
        strong = true;
        return false;
      }
      return true;
    });
    return !strong;
  });

  return {
    status: 'info',
    message: locale.success,
    data: res.data,
    count: res.count,
    skip: res.skip,
    take: res.take,
    strong,
  };
};

export default phraseFindMany;
