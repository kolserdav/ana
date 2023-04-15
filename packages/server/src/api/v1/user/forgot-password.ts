import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  UserLoginBody,
  checkEmail,
  UserLoginResult,
} from '../../../types/interfaces';
import { getHttpCode, getLocale, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { createPasswordHash, createToken } from '../../../utils/auth';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userLogin: RequestHandler<{ Body: UserLoginBody }, Result<UserLoginResult | null>> = async (
  { headers, body },
  reply
) => {
  const { lang } = parseHeaders(headers);
  const { email, password } = body;

  const locale = getLocale(lang).server;
  if (!checkEmail(email)) {
    amqp.sendToQueue({
      type: MessageType.SET_ERROR,
      lang,
      id,
      timeout,
      data: {
        status: 'warn',
        type,
        httpCode: 400,
        message: locale.badRequest,
      },
    });
    return;
  }
  const user = await orm.userFindFirst({ where: { email } });
  if (user.status !== 'info' || !user.data) {
    amqp.sendToQueue({
      id,
      type: MessageType.SET_ERROR,
      lang,
      timeout,
      data: {
        status: user.status,
        type,
        message: user.status === 'error' ? locale.error : locale.notFound,
        httpCode: getHttpCode(user.status),
      },
    });
    return;
  }
  const restore = await orm.userUpdate({
    where: { id: user.data.id },
    data: {
      RestoreLink: {
        create: {},
      },
    },
    include: {
      RestoreLink: true,
    },
  });
  if (restore.status === 'error' || !restore.data || !restore.data?.RestoreLink?.[0]) {
    amqp.sendToQueue({
      type: MessageType.SET_ERROR,
      lang,
      id,
      timeout,
      data: {
        status: 'error',
        type,
        httpCode: 500,
        message: locale.error,
      },
    });
    return;
  }
  const sendRes = await sendEmail<'restore-password'>({
    email,
    locale: lang,
    type: 'restore-password',
    data: {
      name: user.data.name,
      link: `${APP_URL}/${PAGE_RESTORE_PASSWORD_CALLBACK}?${EMAIL_QS}=${email}&${KEY_QS}=${restore.data.RestoreLink[0].id}`,
      expire: RESTORE_LINK_TIMEOUT_IN_HOURS,
    },
  });
  if (sendRes === 1) {
    amqp.sendToQueue({
      id,
      type: MessageType.SET_ERROR,
      lang,
      timeout,
      data: {
        status: 'error',
        type,
        message: locale.error,
        httpCode: 502,
      },
    });
    return;
  }
  amqp.sendToQueue({
    timeout,
    id,
    lang,
    type: MessageType.SET_FORGOT_PASSWORD,
    data: {
      message: locale.emailIsSend,
    },
  });

  reply.type(APPLICATION_JSON).code(200);
  return {
    status: 'info',
    message: '',
    data: { token, userId: user.data.id },
  };
};

export default userLogin;
