import AMQP from '../protocols/amqp';
import WS from '../services/ws';
import { ErrorCode, MessageType, SendMessageArgs } from '../types/interfaces';
import { getLocale, getPseudoHeaders, log } from '../utils/lib';
import { ORM } from '../services/orm';

const orm = new ORM();

class QueueHandler {
  private ws: WS;

  constructor({ ws }: { ws: WS }) {
    this.ws = ws;
  }

  public async test(msg: SendMessageArgs<MessageType.TEST>) {
    this.ws.sendMessage(msg);
  }

  public async getUserCreate({ id, lang, data }: SendMessageArgs<MessageType.GET_USER_CREATE>) {
    const locale = getLocale(lang).server;
    const user = await orm.userCreate(
      {
        data,
      },
      { headers: getPseudoHeaders({ lang }) }
    );
    if (user.status !== 'success') {
      this.ws.sendMessage({
        id,
        type: MessageType.SET_ERROR,
        lang,
        data: {
          code: ErrorCode.createUser,
          message: locale.error,
        },
      });
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
          code: ErrorCode.userCheckEmail,
          message: locale.error,
        },
      });
    }
    this.ws.sendMessage({
      id,
      lang,
      type: MessageType.SET_USER_CHECK_EMAIL,
      data: user.data !== null,
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
