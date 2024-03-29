import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseCreateBody,
  PhraseCreateResult,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseCreate: RequestHandler<{ Body: PhraseCreateBody }, Result<PhraseCreateResult>> = async (
  { headers, body },
  reply
) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { tags, text, translate, learnLang, nativeLang, reTranslate, deleted } = body;

  const _tags = await orm.tagFindMany({
    where: {
      OR: tags.map((item) => ({
        id: item,
      })),
    },
  });
  if (_tags.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  const createRes = await orm.phraseCreate({
    data: {
      text,
      translate,
      reTranslate,
      userId: id,
      learnLang,
      nativeLang,
      deleted,
      PhraseTag: {
        createMany: {
          data: _tags.data.map((item) => ({ tagId: item.id })),
        },
      },
    },
  });
  if (createRes.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(201);

  return { status: 'info', message: locale.phraseSaved, data: createRes.data };
};

export default phraseCreate;
