import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  GetStatisticsQuery,
  GetStatisticsResult,
  DateFilter,
  DateTruncateArgument,
  GroupBySummaryDateItemCount,
  GroupBySummaryDateItemSum,
  QUERY_STRING_PLUS_SYMBOL,
  QUERY_STRING_MINUS_SYMBOL,
} from '../../../types/interfaces';
import { getHttpCode, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { cleanUserFields } from '../../../components/lib';
import getLocale from '../../../utils/getLocale';
import { Prisma, PrismaClient } from '@prisma/client';

const orm = new ORM();

// 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour'
const getDateTruncArg = (filter: DateFilter): DateTruncateArgument => {
  let res: DateTruncateArgument = 'hour';
  switch (filter) {
    case 'day':
      res = 'hour';
      break;
    case 'week':
      res = 'day';
      break;
    case 'month':
      res = 'week';
      break;
    case 'three-months':
      res = 'week';
      break;
    case 'six-months':
      res = 'month';
      break;
    case 'year':
      res = 'month';
      break;
    default:
      res = 'year';
  }
  return res;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStatistics: RequestHandler<
  { Querystring: GetStatisticsQuery },
  Result<GetStatisticsResult | null>
> = async ({ headers, query }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { gt, dateFilter, timeZone: _timeZone } = query;

  const user = await orm.userFindFirst({ where: { id } });
  if (user.data === null) {
    reply.type(APPLICATION_JSON).code(getHttpCode(user.status));
    return {
      status: 'error',
      data: null,
      message: user.status === 'error' ? locale.error : locale.notFound,
    };
  }
  new PrismaClient().phrase.count;

  const where: Prisma.PhraseWhereInput = {
    AND: [
      {
        userId: id,
      },
      {
        updated: {
          gt,
        },
      },
    ],
  };

  const phrasesCount = await orm.count<Prisma.PhraseCountArgs>('phrase', {
    where,
  });
  if (phrasesCount.status !== 'info') {
    reply.type(APPLICATION_JSON).code(getHttpCode(phrasesCount.status));
    return {
      status: 'error',
      data: null,
      message: phrasesCount.status === 'error' ? locale.error : locale.notFound,
    };
  }

  const cleanData = cleanUserFields(user.data);
  if (cleanData === null) {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      data: null,
      message: user.status === 'error' ? locale.error : locale.notFound,
    };
  }

  const truncArg = getDateTruncArg(dateFilter);

  const timeZone = _timeZone
    .replace(QUERY_STRING_PLUS_SYMBOL, '+')
    .replace(QUERY_STRING_MINUS_SYMBOL, '-');

  const groupPhrases = await orm.$queryRawUnsafe<GroupBySummaryDateItemCount[]>(
    `SELECT DATE_TRUNC('${truncArg}', updated at time zone '${timeZone}') as summary_date, COUNT (id) FROM "Phrase" 
    WHERE "userId"=$1 AND updated::timestamp>$2::timestamp GROUP BY summary_date;`,
    id,
    gt
  );
  if (groupPhrases.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      data: null,
      message: locale.error,
    };
  }

  const groupOnline = await orm.$queryRawUnsafe<GroupBySummaryDateItemSum[]>(
    `SELECT DATE_TRUNC('${truncArg}', updated at time zone '${timeZone}') as summary_date, SUM(EXTRACT(MICROSECONDS from updated::timestamp - created::timestamp)) FROM "OnlineStatistic" 
    WHERE "userId"=$1 AND updated::timestamp>$2::timestamp GROUP BY summary_date;`,
    id,
    gt
  );
  if (groupOnline.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      data: null,
      message: locale.error,
    };
  }

  reply.type(APPLICATION_JSON).code(200);

  const _groupOnline = groupOnline.data.map((item) => {
    const _item = { ...item };
    _item.sum = parseInt(item.sum.toString() as string, 10);
    return _item;
  });
  return {
    status: 'info',
    data: {
      phrasesCount: phrasesCount.data,
      user: cleanData,
      groupPhrases: {
        items: groupPhrases.data,
        max: Math.max(...groupPhrases.data.map((item) => item.count)),
      },
      truncArg,
      groupOnline: {
        items: _groupOnline,
        max: Math.max(..._groupOnline.map((item) => item.sum)),
      },
    },
    message: locale.success,
  };
};

export default getStatistics;
