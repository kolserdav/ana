import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  checkEmail,
  ConfirmEmailBody,
  ConfirmEmailResult,
} from '../../../types/interfaces';
import { getHttpCode, getLocale, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const confirmEmail: RequestHandler<
  { Body: ConfirmEmailBody },
  Result<ConfirmEmailResult | null>
> = async ({ headers, body }, reply) => {
  const { lang } = parseHeaders(headers);
  const { email, key } = body;

  const locale = getLocale(lang).server;
  if (!checkEmail(email)) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      status: 'info',
      message: locale.badRequest,
      data: null,
    };
  }

  const user = await orm.userFindFirst({
    where: { email },
    include: {
      ConfirmLink: {
        where: {
          id: key,
        },
      },
    },
  });
  if (user.status !== 'info' || !user.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(user.status));
    return {
      status: user.status,
      message: user.status === 'error' ? locale.error : locale.notFound,
      data: null,
    };
  }
  if (user.data.confirm) {
    reply.type(APPLICATION_JSON).code(201);
    return {
      status: 'info',
      message: locale.successConfirmEmail,
      data: null,
    };
  }

  const cLink = user.data.ConfirmLink[0];
  if (!cLink) {
    reply.type(APPLICATION_JSON).code(404);
    return {
      status: 'warn',
      message: locale.linkUnaccepted,
      data: null,
    };
  }

  const update = await orm.userUpdate({
    where: {
      id: user.data.id,
    },
    data: {
      ConfirmLink: {
        delete: {
          id: cLink.id,
        },
      },
      confirm: true,
      updated: new Date(),
    },
  });

  if (update.status !== 'info' || !update.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(update.status));
    return {
      status: update.status,
      message: update.status === 'error' ? locale.error : locale.notFound,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(201);
  return {
    status: 'info',
    message: locale.successConfirmEmail,
    data: null,
  };
};

export default confirmEmail;
