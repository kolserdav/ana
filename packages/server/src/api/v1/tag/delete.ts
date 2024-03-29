import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  TagDeleteBody,
  TagDeleteResult,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { getHttpCode, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const tagDelete: RequestHandler<{ Body: TagDeleteBody }, Result<TagDeleteResult>> = async (
  { headers, body },
  reply
) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { tagId } = body;

  const tag = await orm.tagFindFirst({
    where: {
      id: tagId,
    },
    include: {
      PhraseTag: {
        select: {
          id: true,
        },
      },
    },
  });
  if (tag.status !== 'info' || !tag.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(tag.status));
    return {
      status: tag.status,
      message: tag.status === 'error' ? locale.error : locale.notFound,
      data: null,
    };
  }

  const tagU = await orm.tagUpdate({
    where: {
      id: tagId,
    },
    data: {
      PhraseTag: {
        deleteMany: tag.data.PhraseTag,
      },
    },
  });
  if (tagU.status !== 'info' || !tagU.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(tagU.status));
    return {
      status: tagU.status,
      message: tagU.status === 'error' ? locale.error : locale.notFound,
      data: null,
    };
  }

  const res = await orm.tagDelete({
    where: {
      id: tag.data.id,
    },
  });
  if (res.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(201);

  return { status: 'info', message: locale.tagDeleted, data: res.data };
};

export default tagDelete;
