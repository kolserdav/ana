import { Prisma } from '@prisma/client';
import { differenceInHours } from 'date-fns';
import { ORM } from '../services/orm';
import WS from '../services/ws';
import {
  checkEmail,
  EMAIL_QS,
  KEY_QS,
  MessageType,
  PAGE_RESTORE_PASSWORD_CALLBACK,
  SendMessageArgs,
} from '../types/interfaces';
import { createPasswordHash, createRandomSalt, createToken } from '../utils/auth';
import { APP_URL, NULL_TIMEOUT, RESTORE_LINK_TIMEOUT_IN_HOURS } from '../utils/constants';
import { sendEmail } from '../utils/email';
import { getHttpCode, getLocale, getPseudoHeaders } from '../utils/lib';

const orm = new ORM();

class User {
  public async getUserCreate(
    { id, lang, data: _data, timeout, type }: SendMessageArgs<MessageType.GET_USER_CREATE>,
    ws: WS
  ) {
    const locale = getLocale(lang).server;
    const data: Prisma.UserCreateArgs['data'] = { ..._data } as any;
    const salt = createRandomSalt();
    const hash = createPasswordHash({ salt, password: _data.password });
    const { email } = data;
    if (!checkEmail(email)) {
      ws.sendMessage({
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
    // @ts-ignore
    delete data.passwordRepeat;
    const user = await orm.userCreate(
      {
        data,
      },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (user.status !== 'info') {
      ws.sendMessage({
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
    ws.sendMessage({
      id,
      lang,
      timeout,
      type: MessageType.SET_USER_CREATE,
      data: user.data,
    });
  }

  public async getUserCheckEmail(
    { id, lang, timeout, data: { email }, type }: SendMessageArgs<MessageType.GET_USER_CHECK_EMAIL>,
    ws: WS
  ) {
    const locale = getLocale(lang).server;
    if (!checkEmail(email)) {
      ws.sendMessage({
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
    const user = await orm.userFindFirst(
      {
        where: {
          email,
        },
      },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (user.status === 'error') {
      ws.sendMessage({
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
    ws.sendMessage({
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
    ws: WS
  ) {
    const locale = getLocale(lang).server;
    if (!checkEmail(email)) {
      ws.sendMessage({
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
    const user = await orm.userFindFirst(
      {
        where: {
          email,
        },
      },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (user.status !== 'info' || !user.data) {
      ws.sendMessage({
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
      ws.sendMessage({
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
    });

    if (!token) {
      ws.sendMessage({
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

    ws.sendMessage({
      id,
      lang,
      timeout,
      type: MessageType.SET_USER_LOGIN,
      data: { token },
    });
  }

  public async getForgotPassword(
    { data: { email }, lang, id, timeout, type }: SendMessageArgs<MessageType.GET_FORGOT_PASSWORD>,
    ws: WS
  ) {
    const locale = getLocale(lang).server;
    if (!checkEmail(email)) {
      ws.sendMessage({
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
    const user = await orm.userFindFirst(
      { where: { email } },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (user.status !== 'info' || !user.data) {
      ws.sendMessage({
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
    const restore = await orm.userUpdate(
      {
        where: { id: user.data.id },
        data: {
          RestoreLink: {
            create: {},
          },
        },
        include: {
          RestoreLink: true,
        },
      },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (restore.status === 'error' || !restore.data || !restore.data.RestoreLink[0]) {
      ws.sendMessage({
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
      ws.sendMessage({
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
    ws.sendMessage({
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
    ws: WS
  ) {
    const locale = getLocale(lang).server;
    if (!checkEmail(email)) {
      ws.sendMessage({
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
    const user = await orm.userFindFirst(
      {
        where: { email },
        include: {
          RestoreLink: {
            where: {
              id: key,
            },
          },
        },
      },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (user.status !== 'info' || !user.data) {
      ws.sendMessage({
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
      ws.sendMessage({
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
      ws.sendMessage({
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
    ws.sendMessage({
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
    ws: WS
  ) {
    const locale = getLocale(lang).server;
    if (!checkEmail(email)) {
      ws.sendMessage({
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
    const user = await orm.userFindFirst(
      {
        where: { email },
        include: {
          RestoreLink: {
            where: {
              id: key,
            },
          },
        },
      },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (user.status !== 'info' || !user.data) {
      ws.sendMessage({
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
      ws.sendMessage({
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
    const diffsInHours = differenceInHours(new Date(), new Date(created));
    if (diffsInHours >= RESTORE_LINK_TIMEOUT_IN_HOURS) {
      ws.sendMessage({
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

    const res = await orm.userUpdate(
      {
        where: {
          id: user.data.id,
        },
        data: {
          salt,
          password: hash,
          updated: new Date(),
        },
      },
      { headers: getPseudoHeaders({ lang }) }
    );

    if (res.status !== 'info') {
      ws.sendMessage({
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

    ws.sendMessage({
      timeout,
      id,
      lang,
      type: MessageType.SET_RESTORE_PASSWORD,
      data: null,
    });
  }
}

export default User;
