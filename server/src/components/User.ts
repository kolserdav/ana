import { Prisma } from '@prisma/client';
import { differenceInHours } from 'date-fns';
import { ORM } from '../services/orm';
import WS from '../services/ws';
import {
  checkEmail,
  EMAIL_QS,
  ErrorCode,
  KEY_QS,
  MessageType,
  PAGE_RESTORE_PASSWORD_CALLBACK,
  SendMessageArgs,
} from '../types/interfaces';
import { createPasswordHash, createRandomSalt, createToken } from '../utils/auth';
import { APP_URL, NULL_TIMEOUT, RESTORE_LINK_TIMEOUT } from '../utils/constants';
import { sendEmail } from '../utils/email';
import { getHttpCode, getLocale, getPseudoHeaders } from '../utils/lib';

const orm = new ORM();

class User {
  public async getUserCreate(
    { id, lang, data: _data, timeout }: SendMessageArgs<MessageType.GET_USER_CREATE>,
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
          code: ErrorCode.createUser,
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
          code: ErrorCode.createUser,
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
    { id, lang, timeout, data: { email } }: SendMessageArgs<MessageType.GET_USER_CHECK_EMAIL>,
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
          code: ErrorCode.userCheckEmail,
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
          code: ErrorCode.userCheckEmail,
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
    { lang, id, timeout, data: { email, password } }: SendMessageArgs<MessageType.GET_USER_LOGIN>,
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
          code: ErrorCode.userLogin,
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
          code: ErrorCode.userLogin,
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
          code: ErrorCode.userLogin,
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
          code: ErrorCode.userLogin,
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
    { data: { email }, lang, id, timeout }: SendMessageArgs<MessageType.GET_FORGOT_PASSWORD>,
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
          code: ErrorCode.forgotPassword,
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
          code: ErrorCode.forgotPassword,
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
          code: ErrorCode.forgotPassword,
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
        expire: differenceInHours(RESTORE_LINK_TIMEOUT, NULL_TIMEOUT),
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
          code: ErrorCode.forgotPassword,
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
}

export default User;
