import { PrismaClient } from '@prisma/client';
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
  const { orderBy, skip: _skip, take: _take } = query;

  const skip = _skip ? parseInt(_skip, 10) : undefined;
  const take = _skip ? parseInt(_take, 10) : undefined;

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
