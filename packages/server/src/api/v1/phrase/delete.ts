import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseDeleteBody,
  PhraseDeleteResult,
  Result,
} from '../../../types/interfaces';
import { getHttpCode, getLocale, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseDelete: RequestHandler<{ Body: PhraseDeleteBody }, Result<PhraseDeleteResult>> = async (
  { headers, body },
  reply
) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { phraseId } = body;

  const getRes = await orm.phraseFindFirst({
    where: {
      id: phraseId,
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
      data: null,
    };
  }

  const updRes = await orm.phraseUpdate({
    where: {
      id: phraseId,
    },
    data: {
      PhraseTag: {
        deleteMany: getRes.data.PhraseTag,
      },
    },
  });
  if (updRes.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  const delRes = await orm.phraseDelete({
    where: {
      id: phraseId,
    },
  });
  if (delRes.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(201);

  return { status: 'info', message: locale.phraseDeleted, data: delRes.data };
};

export default phraseDelete;
