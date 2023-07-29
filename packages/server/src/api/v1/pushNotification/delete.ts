import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PushNotificationDeleteBody,
  PushNotificationDeleteResult,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const pushNotificationDelete: RequestHandler<
  { Body: PushNotificationDeleteBody },
  Result<PushNotificationDeleteResult>
> = async ({ headers, body }, reply) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { id } = body;

  const notification = await orm.pushNotificationDelete({
    where: {
      id,
    },
  });
  if (notification.status === 'error') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(201);

  return { status: 'info', message: locale.pushNotificationDeleted, data: notification.data };
};

export default pushNotificationDelete;
