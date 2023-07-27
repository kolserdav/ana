import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PushNotificationFindManyQuery,
  PushNotificationFindManyResult,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const pushNotificationFindMany: RequestHandler<
  { Querystring: PushNotificationFindManyQuery },
  Result<PushNotificationFindManyResult>
> = async ({ headers, query }, reply) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { skip: _skip, take: _take } = query;
  const skipNum = parseInt(_skip, 10);
  const takeNum = parseInt(_take, 10);

  const skip = Number.isNaN(skipNum) ? undefined : skipNum;
  const take = Number.isNaN(takeNum) ? undefined : takeNum;

  const notifications = await orm.pushNotificationFindMany({
    skip,
    take,
    orderBy: {
      updated: 'desc',
    },
  });
  if (notifications.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: [],
    };
  }

  reply.type(APPLICATION_JSON).code(200);

  return {
    status: 'info',
    message: locale.success,
    data: notifications.data,
    count: notifications.count,
    skip: notifications.skip,
    take: notifications.take,
  };
};

export default pushNotificationFindMany;
