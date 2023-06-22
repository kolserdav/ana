import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  SelectorCreateBody,
  SelectorCreateResult,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const selectorCreate: RequestHandler<
  { Body: SelectorCreateBody },
  Result<SelectorCreateResult>
> = async ({ headers, body }, reply) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;
  const { type, value } = body;

  const selectors = await orm.selectorFindMany({
    where: {
      type,
    },
  });
  if (selectors.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  if (selectors.data.length) {
    const delRes = await orm.selectorDeleteMany({
      where: {
        id: {
          in: selectors.data.map((item) => item.id),
        },
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
  }

  const selector = await orm.selectorCreate({
    data: {
      type,
      value,
    },
  });
  if (selector.status === 'error') {
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
    data: selector.data,
    message: locale.success,
  };
};

export default selectorCreate;
