import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  GetStatisticsQuery,
  GetStatisticsResult,
} from '../../../types/interfaces';
import { getHttpCode, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { cleanUserFields } from '../../../components/lib';
import getLocale from '../../../utils/getLocale';
import { Prisma, PrismaClient } from '@prisma/client';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStatistics: RequestHandler<
  { Querystring: GetStatisticsQuery },
  Result<GetStatisticsResult | null>
> = async ({ headers, query }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { gt } = query;

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

  const phrases = await orm.phraseGroupBy({ where, by: ['learnLang'] });

  const date = new Date().toISOString();

  const r = await orm.$queryRaw(
    `CREATE VIEW record_by_month AS SELECT distinct $1 id, date_trunc('month', $2) updated FROM "Phrase";`,
    date,
    date
  );
  console.log(r);

  reply.type(APPLICATION_JSON).code(200);
  return {
    status: 'info',
    data: {
      phrasesCount: phrasesCount.data,
      user: cleanData,
    },
    message: locale.success,
  };
};

export default getStatistics;
