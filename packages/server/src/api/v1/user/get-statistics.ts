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
  GroupBySummaryDateItemCountRaw,
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

  const onlineS = await orm.onlineStatisticAggregate({
    _max: {
      created: true,
    },
    where: {
      userId: id,
    },
  });
  if (onlineS.data && onlineS.data._max.created) {
    const onS = await orm.onlineStatisticFindFirst({
      where: { created: onlineS.data._max.created },
    });
    if (onlineS.status === 'info' && onS.data) {
      await orm.onlineStatisticUpdate({
        where: { id: onS.data.id },
        data: {
          updated: new Date(),
        },
      });
    }
  }

  const truncArg = getDateTruncArg(dateFilter);

  const timeZone = _timeZone
    .replace(QUERY_STRING_PLUS_SYMBOL, '+')
    .replace(QUERY_STRING_MINUS_SYMBOL, '-');

  const groupPhrasesCreated = await orm.$queryRawUnsafe<GroupBySummaryDateItemCountRaw[]>(
    `SELECT DATE_TRUNC('${truncArg}', created at time zone '${timeZone}') as summary_date, COUNT (id) FROM "Phrase" 
    WHERE "userId"=$1 AND created::timestamp>$2::timestamp AND updated = created AND deleted = false GROUP BY summary_date ORDER BY summary_date ASC;`,
    id,
    gt
  );
  if (groupPhrasesCreated.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      data: null,
      message: locale.error,
    };
  }

  const groupPhrasesUpdated = await orm.$queryRawUnsafe<GroupBySummaryDateItemCountRaw[]>(
    `SELECT DATE_TRUNC('${truncArg}', updated at time zone '${timeZone}') as summary_date, COUNT (id) FROM "Phrase" 
    WHERE "userId"=$1 AND updated::timestamp>$2::timestamp AND NOT(updated = created) AND deleted = false GROUP BY summary_date ORDER BY summary_date ASC;`,
    id,
    gt
  );
  if (groupPhrasesUpdated.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      data: null,
      message: locale.error,
    };
  }

  const groupPhrasesDeleted = await orm.$queryRawUnsafe<GroupBySummaryDateItemCountRaw[]>(
    `SELECT DATE_TRUNC('${truncArg}', updated at time zone '${timeZone}') as summary_date, COUNT (id) FROM "Phrase" 
  WHERE "userId"=$1 AND updated::timestamp>$2::timestamp AND deleted = true GROUP BY summary_date ORDER BY summary_date ASC;`,
    id,
    gt
  );
  if (groupPhrasesDeleted.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      data: null,
      message: locale.error,
    };
  }

  const groupOnline = await orm.$queryRawUnsafe<GroupBySummaryDateItemSum[]>(
    `SELECT DATE_TRUNC('${truncArg}', updated at time zone '${timeZone}') as summary_date, SUM(EXTRACT(MICROSECONDS from updated::timestamp - created::timestamp)) FROM "OnlineStatistic" 
    WHERE "userId"=$1 AND updated::timestamp>$2::timestamp GROUP BY summary_date ORDER BY summary_date ASC;`,
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

  const groupPhrases = compareOrderByCounts(
    groupPhrasesUpdated.data,
    groupPhrasesCreated.data,
    groupPhrasesDeleted.data
  );

  return {
    status: 'info',
    data: {
      phrasesCount: phrasesCount.data,
      user: cleanData,
      groupPhrases: {
        items: groupPhrases,
      },
      truncArg,
      groupOnline: {
        items: _groupOnline,
      },
    },
    message: locale.success,
  };
};

const getDateItem = (arr: GroupBySummaryDateItemCountRaw[], date: string) =>
  arr.find((item) => item.summary_date === date);

const compareDates = (
  a: GroupBySummaryDateItemCountRaw[],
  b: GroupBySummaryDateItemCountRaw[],
  c: GroupBySummaryDateItemCountRaw[]
): string[] => {
  return [
    a.map((item) => item.summary_date),
    b.map((item) => item.summary_date),
    c.map((item) => item.summary_date),
  ]
    .flat()
    .filter((value: string, index: number, array: string[]) => {
      return array.indexOf(value) === index;
    })
    .sort((_a, _b) => {
      if (new Date(_a).getTime() < new Date(_b).getTime()) {
        return -1;
      }
      return 1;
    });
};

function compareOrderByCounts(
  updated: GroupBySummaryDateItemCountRaw[],
  created: GroupBySummaryDateItemCountRaw[],
  deleted: GroupBySummaryDateItemCountRaw[]
): GroupBySummaryDateItemCount[] {
  const compared = compareDates(updated, created, deleted);

  return compared.map((item) => {
    const _created = getDateItem(created, item);
    const _updated = getDateItem(updated, item);
    const _deleted = getDateItem(deleted, item);
    const _item: GroupBySummaryDateItemCount = {
      summary_date: item,
      count: 0,
      updated: _updated?.count || 0,
      created: _created?.count || 0,
      deleted: _deleted?.count || 0,
    };
    return _item;
  });
}

export default getStatistics;
