import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  checkEmail,
  UserCreateBody,
  UserCleanResult,
} from '../../../types/interfaces';
import { getConfirmEmailLink, getHttpCode, log, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { createPasswordHash, createRandomSalt } from '../../../utils/auth';
import { Prisma } from '@prisma/client';
import { sendEmail } from '../../../utils/email';
import { cleanUserFields } from '../../../components/lib';
import getLocale from '../../../utils/getLocale';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userCreate: RequestHandler<{ Body: UserCreateBody }, Result<UserCleanResult | null>> = async (
  { headers, body },
  reply
) => {
  const { lang } = parseHeaders(headers);
  const { email, password, name } = body;

  const locale = getLocale(lang).server;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Prisma.UserCreateArgs['data'] = { email, name } as any;
  if (!checkEmail(email)) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      status: 'warn',
      message: locale.badRequest,
      data: null,
    };
  }
  const salt = createRandomSalt();
  const hash = createPasswordHash({ salt, password });
  data.password = hash;
  data.salt = salt;
  data.lang = lang;
  const user = await orm.userCreate({
    data: {
      ...data,
      ConfirmLink: {
        create: {},
      },
    },
    include: {
      ConfirmLink: true,
    },
  });

  if (user.status !== 'info' || !user.data || !user.data?.ConfirmLink?.[0]) {
    reply.type(APPLICATION_JSON).code(getHttpCode(user.status));
    return {
      status: user.status,
      message: locale.error,
      data: null,
    };
  }

  const sendRes = await sendEmail<'confirm-email'>({
    email,
    type: 'confirm-email',
    locale: lang,
    subject: locale.mailSubjects.confirmEmail,
    data: {
      name: user.data.name || '',
      link: getConfirmEmailLink({ user: user.data, lang }),
    },
  });

  if (sendRes === 1) {
    log('warn', 'Not send email to user', { user: user.data });
  }

  const cleanData = cleanUserFields(user.data);

  reply.type(APPLICATION_JSON).code(201);
  return {
    status: 'info',
    message: locale.success,
    data: cleanData,
  };
};

export default userCreate;
