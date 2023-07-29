import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PushNotificationUpdateBody,
  PushNotificationUpdateResult,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const pushNotificationUpdate: RequestHandler<
  { Body: PushNotificationUpdateBody },
  Result<PushNotificationUpdateResult>
> = async ({ headers, body }, reply) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { title, description, path, lang: _lang, id, priority } = body;

  const notification = await orm.pushNotificationUpdate({
    where: {
      id,
    },
    data: {
      title,
      description,
      path,
      lang: _lang,
      priority,
      updated: new Date(),
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

  return { status: 'info', message: locale.pushNotificationSaved, data: notification.data };
};

export default pushNotificationUpdate;
