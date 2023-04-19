import { Prisma } from '@prisma/client';
import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseUpdateBody,
  PhraseUpdateResult,
  Result,
} from '../../../types/interfaces';
import { getHttpCode, getLocale, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseUpdate: RequestHandler<{ Body: PhraseUpdateBody }, Result<PhraseUpdateResult>> = async (
  { headers, body },
  reply
) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const {
    phraseId,
    data: { text, translate, tags, learnLang, nativeLang },
  } = body;

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

  const _data: Prisma.PhraseUpdateArgs['data'] = {};
  if (text) {
    _data.text = text;
  }
  if (learnLang) {
    _data.learnLang = learnLang;
  }
  if (nativeLang) {
    _data.nativeLang = nativeLang;
  }
  if (translate) {
    _data.translate = translate;
  } else {
    _data.translate = null;
  }
  if (tags) {
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
    _data.PhraseTag = {
      createMany: {
        data: tags.map((item) => ({ tagId: item })),
      },
    };
  }
  _data.updated = new Date();

  const updRes = await orm.phraseUpdate({
    where: {
      id: phraseId,
    },
    data: _data,
    include: {
      PhraseTag: {
        include: {
          Tag: true,
        },
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

  reply.type(APPLICATION_JSON).code(201);

  return { status: 'info', message: locale.phraseSaved, data: updRes.data };
};

export default phraseUpdate;
