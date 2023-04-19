import { Prisma } from '@prisma/client';
import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  TagUpdateBody,
  TagUpdateResult,
} from '../../../types/interfaces';
import { getHttpCode, getLocale, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const tagUpdate: RequestHandler<{ Body: TagUpdateBody }, Result<TagUpdateResult>> = async (
  { headers, body },
  reply
) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const {
    tagId,
    data: { text },
  } = body;

  const getRes = await orm.tagFindFirst({
    where: {
      id: tagId,
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

  const _data: Prisma.TagUpdateArgs['data'] = {};
  if (text) {
    _data.text = text;
  }
  _data.updated = new Date();

  const updRes = await orm.tagUpdate({
    where: {
      id: getRes.data.id,
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
  if (updRes.status === 'error' || !updRes.data) {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(201);
  return {
    status: 'info',
    message: `${locale.tagUpdated}: ${updRes.data.PhraseTag.length}`,
    data: updRes.data,
  };
};

export default tagUpdate;
