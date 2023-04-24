import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  TagCreateBody,
  TagCreateResult,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const tagCreate: RequestHandler<{ Body: TagCreateBody }, Result<TagCreateResult>> = async (
  { headers, body },
  reply
) => {
  const { lang, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { text } = body;

  const _tags = await orm.tagFindMany({
    where: {
      text,
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
  if (_tags.data.length) {
    reply.type(APPLICATION_JSON).code(409);
    return {
      status: 'warn',
      message: locale.tagExists,
      data: null,
    };
  }

  const createRes = await orm.tagCreate({
    data: {
      text,
      userId: id,
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

  return { status: 'info', message: locale.tagSaved, data: createRes.data };
};

export default tagCreate;
