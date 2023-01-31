import { Prisma } from '@prisma/client';
import AMQP from '../protocols/amqp';
import WS from '../services/ws';
import { ErrorCode, MessageType, SendMessageArgs } from '../types/interfaces';
import { getHttpCode, getLocale, getPseudoHeaders, log } from '../utils/lib';
import { ORM } from '../services/orm';
import { createPasswordHash, createRandomSalt, createToken } from '../utils/auth';

const orm = new ORM();

class QueueHandler {
  private ws: WS;

  constructor({ ws }: { ws: WS }) {
    this.ws = ws;
  }

  public async test(msg: SendMessageArgs<MessageType.TEST>) {
    this.ws.sendMessage(msg);
  }

  public async getUserCreate({
    id,
    lang,
    data: _data,
  }: SendMessageArgs<MessageType.GET_USER_CREATE>) {
    const locale = getLocale(lang).server;
    const data: Prisma.UserCreateArgs['data'] = { ..._data } as any;
    const salt = createRandomSalt();
    const hash = createPasswordHash({ salt, password: _data.password });
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
      this.ws.sendMessage({
        id,
        type: MessageType.SET_ERROR,
        lang,
        data: {
          status: user.status,
          code: ErrorCode.createUser,
          message: locale.error,
          httpCode: getHttpCode(user.status),
        },
      });
      return;
    }
    this.ws.sendMessage({
      id,
      lang,
      type: MessageType.SET_USER_CREATE,
      data: user.data,
    });
  }

  public async getUserCheckEmail({
    id,
    lang,
    data: { email },
  }: SendMessageArgs<MessageType.GET_USER_CHECK_EMAIL>) {
    const locale = getLocale(lang).server;
    const user = await orm.userFindFirst(
      {
        where: {
          email,
        },
      },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (user.status === 'error') {
      this.ws.sendMessage({
        id,
        type: MessageType.SET_ERROR,
        lang,
        data: {
          status: user.status,
          code: ErrorCode.userCheckEmail,
          message: locale.error,
          httpCode: 500,
        },
      });
      return;
    }
    this.ws.sendMessage({
      id,
      lang,
      type: MessageType.SET_USER_CHECK_EMAIL,
      data: user.data !== null,
    });
  }

  private async getUserLogin({
    lang,
    id,
    data: { email, password },
  }: SendMessageArgs<MessageType.GET_USER_LOGIN>) {
    const locale = getLocale(lang).server;
    const user = await orm.userFindFirst(
      {
        where: {
          email,
        },
      },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (user.status !== 'info' || !user.data) {
      this.ws.sendMessage({
        id,
        type: MessageType.SET_ERROR,
        lang,
        data: {
          status: user.status,
          code: ErrorCode.userLogin,
          message: locale.error,
          httpCode: getHttpCode(user.status),
        },
      });
      return;
    }

    const hash = createPasswordHash({ password, salt: user.data.salt });
    if (hash !== user.data.password) {
      this.ws.sendMessage({
        id,
        type: MessageType.SET_ERROR,
        lang,
        data: {
          status: user.status,
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
      this.ws.sendMessage({
        id,
        type: MessageType.SET_ERROR,
        lang,
        data: {
          status: 'error',
          code: ErrorCode.userLogin,
          message: locale.error,
          httpCode: 502,
        },
      });
      return;
    }

    this.ws.sendMessage({
      id,
      lang,
      type: MessageType.SET_USER_LOGIN,
      data: { token },
    });
  }

  public async queues({ amqp }: { amqp: AMQP }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    amqp.consume(async (msg: SendMessageArgs<any>) => {
      const { type } = msg;
      switch (type) {
        case MessageType.TEST:
          await this.test(msg);
          break;
        case MessageType.GET_USER_CREATE:
          await this.getUserCreate(msg);
          break;
        case MessageType.GET_USER_LOGIN:
          await this.getUserLogin(msg);
          break;
        case MessageType.GET_USER_CHECK_EMAIL:
          await this.getUserCheckEmail(msg);
          break;
        default:
          log('warn', 'Default case of consume queue', msg);
      }
    });
  }
}

export default QueueHandler;
