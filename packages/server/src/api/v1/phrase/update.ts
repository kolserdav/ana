import { Prisma } from '@prisma/client';
import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseUpdateBody,
  PhraseUpdateResult,
  Result,
} from '../../../types/interfaces';
import { getHttpCode, parseHeaders } from '../../../utils/lib';
import getLocale from '../../../utils/getLocale';

const orm = new ORM();

const phraseUpdate: RequestHandler<{ Body: PhraseUpdateBody }, Result<PhraseUpdateResult>> = async (
  { headers, body },
  reply
) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const {
    phraseId,
    data: { text, translate, tags, learnLang, nativeLang, reTranslate, deleted },
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

  const _data: Prisma.PhraseUpdateArgs['data'] = {
    text,
    learnLang,
    nativeLang,
    translate,
    reTranslate,
    deleted,
  };

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
          Tag: {
            include: {
              PhraseTag: {
                select: {
                  phraseId: true,
                },
              },
            },
          },
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
