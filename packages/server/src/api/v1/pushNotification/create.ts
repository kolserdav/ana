import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PushNotificationCreateBody,
  PushNotificationCreateResult,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const pushNotificationCreate: RequestHandler<
  { Body: PushNotificationCreateBody },
  Result<PushNotificationCreateResult>
> = async ({ headers, body }, reply) => {
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const { title, description, path, lang: _lang } = body;

  const notification = await orm.pushNotificationCreate({
    data: {
      title,
      description,
      path,
      lang: _lang,
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

export default pushNotificationCreate;
