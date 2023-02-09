import { Prisma } from '@prisma/client';
import { differenceInHours } from 'date-fns';
import { ORM } from '../services/orm';
import {
  checkEmail,
  EMAIL_QS,
  KEY_QS,
  MessageType,
  PAGE_CONFIRM_EMAIL,
  PAGE_RESTORE_PASSWORD_CALLBACK,
  SendMessageArgs,
} from '../types/interfaces';
import { createPasswordHash, createRandomSalt, createToken } from '../utils/auth';
import { APP_URL, RESTORE_LINK_TIMEOUT_IN_HOURS } from '../utils/constants';
import { sendEmail } from '../utils/email';
import { getHttpCode, getLocale, log } from '../utils/lib';
import AMQP from '../protocols/amqp';

const orm = new ORM();

class User {
  public async getUserCreate(
    { id, lang, data: _data, timeout, type }: SendMessageArgs<MessageType.GET_USER_CREATE>,
    amqp: AMQP
  ) {
    const locale = getLocale(lang).server;
    const data: Prisma.UserCreateArgs['data'] = { ..._data } as any;
    const salt = createRandomSalt();
    const hash = createPasswordHash({ salt, password: _data.password });
    const { email } = data;
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
    data.password = hash;
    data.salt = salt;
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
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: user.status,
          type,
          message: locale.error,
          httpCode: getHttpCode(user.status),
        },
      });
      return;
    }

    const sendRes = await sendEmail<'confirm-email'>({
      email,
      type: 'confirm-email',
      locale: lang,
      data: {
        name: user.data.name,
        link: `${APP_URL}${PAGE_CONFIRM_EMAIL}?${EMAIL_QS}=${user.data.email}&${KEY_QS}=${user.data.ConfirmLink[0].id}`,
      },
    });

    if (sendRes === 1) {
      log('warn', 'Not send email to user', { user });
      return;
    }

    amqp.sendToQueue({
      id,
      lang,
      timeout,
      type: MessageType.SET_USER_CREATE,
      data: user.data,
    });
  }

  public async getUserCheckEmail(
    { id, lang, timeout, data: { email }, type }: SendMessageArgs<MessageType.GET_USER_CHECK_EMAIL>,
    amqp: AMQP
  ) {
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
    const user = await orm.userFindFirst({
      where: {
        email,
      },
    });
    if (user.status === 'error') {
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: user.status,
          type,
          message: locale.error,
          httpCode: 500,
        },
      });
      return;
    }
    amqp.sendToQueue({
      id,
      lang,
      timeout,
      type: MessageType.SET_USER_CHECK_EMAIL,
      data: user.data !== null,
    });
  }

  public async getUserLogin(
    {
      lang,
      id,
      timeout,
      data: { email, password },
      type,
    }: SendMessageArgs<MessageType.GET_USER_LOGIN>,
    amqp: AMQP
  ) {
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
    const user = await orm.userFindFirst({
      where: {
        email,
      },
    });
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

    const hash = createPasswordHash({ password, salt: user.data.salt });
    if (hash !== user.data.password) {
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: 'warn',
          type,
          message: locale.wrongPassword,
          httpCode: 401,
        },
      });
      return;
    }

    const token = createToken({
      id: user.data.id,
      password: user.data.password,
    });

    if (!token) {
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
      id,
      lang,
      timeout,
      type: MessageType.SET_USER_LOGIN,
      data: { token, userId: user.data.id },
    });
  }

  public async getForgotPassword(
    { data: { email }, lang, id, timeout, type }: SendMessageArgs<MessageType.GET_FORGOT_PASSWORD>,
    amqp: AMQP
  ) {
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
  }

  public async getCheckRestoreKey(
    {
      data: { email, key },
      lang,
      id,
      timeout,
      type,
    }: SendMessageArgs<MessageType.GET_CHECK_RESTORE_KEY>,
    amqp: AMQP
  ) {
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
    const user = await orm.userFindFirst({
      where: { email },
      include: {
        RestoreLink: {
          where: {
            id: key,
          },
        },
      },
    });
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
    if (!user.data.RestoreLink[0]) {
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: 'warn',
          type,
          message: locale.linkUnaccepted,
          httpCode: 404,
        },
      });
      return;
    }
    const { created } = user.data.RestoreLink[0];
    const diffsInHours = differenceInHours(new Date(), created);
    if (diffsInHours >= RESTORE_LINK_TIMEOUT_IN_HOURS) {
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: 'warn',
          type,
          message: locale.linkExpired,
          httpCode: 408,
        },
      });
      return;
    }
    amqp.sendToQueue({
      timeout,
      id,
      lang,
      type: MessageType.SET_CHECK_RESTORE_KEY,
      data: null,
    });
  }

  public async getRestorePassword(
    {
      data: { email, key, password },
      lang,
      id,
      timeout,
      type,
    }: SendMessageArgs<MessageType.GET_RESTORE_PASSWORD>,
    amqp: AMQP
  ) {
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
    const user = await orm.userFindFirst({
      where: { email },
      include: {
        RestoreLink: {
          where: {
            id: key,
          },
        },
      },
    });
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
    if (!user.data.RestoreLink[0]) {
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: 'warn',
          type,
          message: locale.linkUnaccepted,
          httpCode: 404,
        },
      });
      return;
    }
    const { created, id: restoreLinkId } = user.data.RestoreLink[0];
    const diffsInHours = differenceInHours(new Date(), new Date(created));
    if (diffsInHours >= RESTORE_LINK_TIMEOUT_IN_HOURS) {
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: 'warn',
          type,
          message: locale.linkExpired,
          httpCode: 408,
        },
      });
      return;
    }

    const salt = createRandomSalt();
    const hash = createPasswordHash({ password, salt });

    const res = await orm.userUpdate({
      where: {
        id: user.data.id,
      },
      data: {
        salt,
        password: hash,
        updated: new Date(),
        RestoreLink: {
          delete: {
            id: restoreLinkId,
          },
        },
      },
    });

    if (res.status !== 'info') {
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: res.status,
          type,
          message: res.message,
          httpCode: res.code,
        },
      });
      return;
    }

    amqp.sendToQueue({
      timeout,
      id,
      lang,
      type: MessageType.SET_RESTORE_PASSWORD,
      data: null,
    });
  }

  public async getConfirmEmail(
    {
      id,
      timeout,
      type,
      lang,
      data: { email, key },
    }: SendMessageArgs<MessageType.GET_CONFIRM_EMAIL>,
    amqp: AMQP
  ) {
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
    if (user.data.confirm) {
      amqp.sendToQueue({
        timeout,
        id,
        lang,
        type: MessageType.SET_CONFIRM_EMAIL,
        data: {
          message: locale.successConfirmEmail,
        },
      });
      return;
    }
    const cLink = user.data.ConfirmLink[0];
    if (!cLink) {
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: 'warn',
          type,
          message: locale.linkUnaccepted,
          httpCode: 404,
        },
      });
      return;
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
      amqp.sendToQueue({
        id,
        type: MessageType.SET_ERROR,
        lang,
        timeout,
        data: {
          status: update.status,
          type,
          message: update.status === 'error' ? locale.error : locale.notFound,
          httpCode: getHttpCode(update.status),
        },
      });
      return;
    }

    amqp.sendToQueue({
      timeout,
      id,
      lang,
      type: MessageType.SET_CONFIRM_EMAIL,
      data: {
        message: locale.successConfirmEmail,
      },
    });
  }

  public async getUserFindFirst(msg: SendMessageArgs<MessageType.GET_USER_FIND_FIRST>, amqp: AMQP) {
    const user = await orm.userFindFirst(msg.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _msg: SendMessageArgs<MessageType.SET_USER_FIND_FIRST> = { ...msg } as any;
    _msg.data = user.data;
    if (_msg.data) {
      delete _msg.data.password;
      delete _msg.data.salt;
    }
    amqp.sendToQueue(_msg);
  }
}

export default User;
