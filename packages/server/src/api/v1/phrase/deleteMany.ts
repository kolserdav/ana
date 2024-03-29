import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseDeleteManyBody,
  PhraseDeleteManyResult,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { getHttpCode, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseDeleteMany: RequestHandler<
  { Body: PhraseDeleteManyBody },
  Result<PhraseDeleteManyResult>
> = async ({ headers, body }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { phrases } = body;

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

  for (let i = 0; getRes.data[i]; i++) {
    const phrase = getRes.data[i];
    if (!phrase) {
      continue;
    }
    const updRes = await orm.phraseUpdate({
      where: {
        id: phrase.id,
      },
      data: {
        PhraseTag: {
          deleteMany: phrase.PhraseTag,
        },
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
  }

  const delRes = await orm.phraseDeleteMany({
    where: {
      id: {
        in: getRes.data.map((item) => item.id),
      },
    },
  });
  if (delRes.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: [],
    };
  }

  reply.type(APPLICATION_JSON).code(201);

  return { status: 'info', message: locale.phraseDeleted, data: delRes.data };
};

export default phraseDeleteMany;
