import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  checkEmail,
  PAGE_RESTORE_PASSWORD_CALLBACK,
  EMAIL_QS,
  KEY_QS,
  ForgotPasswordBody,
  ForgotPasswordResult,
} from '../../../types/interfaces';
import { getHttpCode, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { sendEmail } from '../../../utils/email';
import { APP_URL, RESTORE_LINK_TIMEOUT_IN_HOURS } from '../../../utils/constants';
import getLocale from '../../../utils/getLocale';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const forgotPassword: RequestHandler<
  { Body: ForgotPasswordBody },
  Result<ForgotPasswordResult | null>
> = async ({ headers, body }, reply) => {
  const { lang } = parseHeaders(headers);
  const { email } = body;

  const locale = getLocale(lang).server;
  if (!checkEmail(email)) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      status: 'warn',
      message: locale.badRequest,
      data: null,
    };
  }
  const user = await orm.userFindFirst({ where: { email } });
  if (user.status !== 'info' || !user.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(user.status));
    return {
      status: user.status,
      message: user.status === 'error' ? locale.error : locale.notFound,
      data: null,
    };
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
    reply.type(APPLICATION_JSON).code(500);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  const sendRes = await sendEmail<'restore-password'>({
    email,
    locale: lang,
    type: 'restore-password',
    subject: locale.mailSubjects.resetPassword,
    data: {
      name: user.data.name || '',
      link: `${APP_URL}${PAGE_RESTORE_PASSWORD_CALLBACK}?${EMAIL_QS}=${email}&${KEY_QS}=${restore.data.RestoreLink[0].id}`,
      expire: RESTORE_LINK_TIMEOUT_IN_HOURS,
    },
  });
  if (sendRes === 1) {
    reply.type(APPLICATION_JSON).code(502);
    return {
      status: 'error',
      message: locale.error,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(201);
  return {
    status: 'info',
    message: locale.emailIsSend,
    data: null,
  };
};

export default forgotPassword;
