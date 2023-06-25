import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseUpdateManyBody,
  PhraseUpdateManyResult,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { getHttpCode, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseUpdateMany: RequestHandler<
  { Body: PhraseUpdateManyBody },
  Result<PhraseUpdateManyResult>
> = async ({ headers, body }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { phrases, data } = body;
  const { deleted } = data;

  const getRes = await orm.phraseFindMany({
    where: {
      AND: [
        {
          id: {
            in: phrases,
          },
        },
        {
          userId: id,
        },
      ],
    },
    include: {
      PhraseTag: {
        select: {
          id: true,
        },
      },
    },
  });
  if (getRes.status !== 'info' || !getRes.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(getRes.status));
    return {
      status: getRes.status,
      message: getRes.message,
      data: [],
    };
  }

  const updRes = await orm.phraseUpdateMany({
    where: {
      id: {
        in: getRes.data.map((item) => item.id),
      },
    },
    data: {
      deleted,
    },
  });
  if (updRes.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: [],
    };
  }

  reply.type(APPLICATION_JSON).code(201);

  return {
    status: 'info',
    message: deleted ? locale.phraseDeleted : locale.phraseSaved,
    data: updRes.data,
  };
};

export default phraseUpdateMany;
