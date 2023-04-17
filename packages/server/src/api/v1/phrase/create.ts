import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseCreateBody,
  PhraseCreateResult,
  Result,
} from '../../../types/interfaces';
import { getLocale, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseCreate: RequestHandler<{ Body: PhraseCreateBody }, Result<PhraseCreateResult>> = async (
  { headers, body },
  reply
) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { tags, text, translate } = body;

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
      translate: translate || null,
      userId: id,
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

  return { status: 'info', message: locale.success, data: createRes.data };
};

export default phraseCreate;
