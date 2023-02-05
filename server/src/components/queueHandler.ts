import AMQP from '../protocols/amqp';
import WS from '../services/ws';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';
import User from './User';

const user = new User();

class QueueHandler {
  private ws: WS;

  constructor({ ws }: { ws: WS }) {
    this.ws = ws;
  }

  public async test(msg: SendMessageArgs<MessageType.TEST>) {
    this.ws.sendMessage(msg);
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
          await user.getUserCreate(msg, this.ws);
          break;
        case MessageType.GET_USER_LOGIN:
          await user.getUserLogin(msg, this.ws);
          break;
        case MessageType.GET_USER_CHECK_EMAIL:
          await user.getUserCheckEmail(msg, this.ws);
          break;
        case MessageType.GET_FORGOT_PASSWORD:
          await user.getForgotPassword(msg, this.ws);
          break;
        case MessageType.GET_CHECK_RESTORE_KEY:
          await user.getCheckRestoreKey(msg, this.ws);
          break;
        case MessageType.GET_RESTORE_PASSWORD:
          await user.getRestorePassword(msg, this.ws);
          break;
        case MessageType.GET_CONFIRM_EMAIL:
          await user.getConfirmEmail(msg, this.ws);
          break;
        default:
          log('warn', 'Default case of consume queue', msg);
      }
    });
  }
}

export default QueueHandler;
