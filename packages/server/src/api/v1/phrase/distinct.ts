import { Prisma } from '@prisma/client';
import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseDistinctQuery,
  PhraseDistinctResult,
  QUERY_STRING_ARRAY_SPLITTER,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { getHttpCode, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseDistinct: RequestHandler<
  { Querystring: PhraseDistinctQuery },
  Result<PhraseDistinctResult>
> = async ({ headers, query }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const { distinct: _distinct, isTrash: _isTrash } = query;
  const locale = getLocale(lang).server;

  const isTrash = _isTrash === '1';
  let distinct: Prisma.Enumerable<Prisma.PhraseScalarFieldEnum> = [];
  if (_distinct) {
    distinct = (_distinct as string).split(
      QUERY_STRING_ARRAY_SPLITTER
    ) as Prisma.Enumerable<Prisma.PhraseScalarFieldEnum>;
  }

  let badRequest = false;
  (distinct as string[]).forEach((item) => {
    if (!Object.keys(Prisma.PhraseScalarFieldEnum).includes(item)) {
      badRequest = true;
    }
  });

  if (!_distinct || badRequest) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      status: 'warn',
      message: locale.badRequest,
      data: [],
    };
  }

  const res = await orm.phraseFindMany({
    where: {
      AND: [{ userId: id }, { deleted: isTrash }],
    },
    distinct,
    select: {
      [distinct as string]: true,
    },
  });
  if (res.status !== 'info') {
    reply.type(APPLICATION_JSON).code(getHttpCode(res.status));
    return {
      status: res.status,
      message: res.status === 'error' ? locale.error : locale.notFound,
      data: [],
    };
  }

  reply.type(APPLICATION_JSON).code(200);

  const result: string[] = [];
  res.data.forEach((item) => {
    const distinctVal = item[distinct as string] as any;
    if (distinctVal) {
      result.push(distinctVal);
    }
  });

  return { status: 'info', message: locale.success, data: result };
};

export default phraseDistinct;
