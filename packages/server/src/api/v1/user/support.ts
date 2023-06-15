import { RequestHandler } from '../../../types';
import { APPLICATION_JSON, Result, SupportBody, SupportResult } from '../../../types/interfaces';
import { getHttpCode, log, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { sendEmail } from '../../../utils/email';
import { cleanUserFields } from '../../../components/lib';
import getLocale from '../../../utils/getLocale';
import { SUPPORT_EMAIL, USER_NAME_DEFAULT } from '../../../utils/constants';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const support: RequestHandler<{ Body: SupportBody }, Result<SupportResult | null>> = async (
  { headers, body },
  reply
) => {
  const { lang, id } = parseHeaders(headers);

  const { subject, text, date } = body;

  const locale = getLocale(lang).server;

  const user = await orm.userFindFirst({
    where: { id },
  });

  if (user.status !== 'info' || !user.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(user.status));
    return {
      status: user.status,
      message: locale.error,
      data: null,
    };
  }

  if (!user.data.confirm) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      status: 'warn',
      message: locale.badRequest,
      data: null,
    };
  }

  const sendRes = await sendEmail({
    email: SUPPORT_EMAIL,
    type: 'admin-support',
    locale: lang,
    subject: subject,
    data: {
      message: text,
      date,
      name: user.data.name || USER_NAME_DEFAULT,
      email: user.data.email,
    },
  });

  if (sendRes === 1) {
    log('warn', 'Not send email to user', { user: user.data });
  }

  const cleanData = cleanUserFields(user.data);

  reply.type(APPLICATION_JSON).code(201);
  return {
    status: 'info',
    message: locale.supportSuccess,
    data: cleanData,
  };
};

export default support;
