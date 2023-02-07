import AMQP from '../protocols/amqp';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';
import User from '../components/User';
import { Protocol } from '../types';

const user = new User();

class QueueWorker extends AMQP {
  private protocol: Protocol;

  private amqp: AMQP;

  constructor({ protocol }: { protocol: Protocol }) {
    super({ queue: `worker-${protocol}` });
    this.amqp = new AMQP({ queue: `master-${protocol}` });
    this.protocol = protocol;
    this.handleQueues();
  }

  public async testW(msg: SendMessageArgs<MessageType.TEST>) {
    this.amqp.sendToQueue(msg);
  }

  public async test(msg: SendMessageArgs<MessageType.TEST>) {
    this.amqp.sendToQueue(msg);
  }

  public async handleQueues() {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.checkChannel()) {
          clearInterval(interval);
          resolve(0);
        }
      }, 100);
    });
    this.consumeWorker();
  }

  public async consumeWorker() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.consume(async (msg: SendMessageArgs<any>) => {
      const { type } = msg;
      switch (type) {
        case MessageType.GET_USER_FIND_FIRST:
          await user.getUserFindFirst(msg, this.amqp);
          break;
        case MessageType.TEST:
          await this.test(msg);
          break;
        case MessageType.GET_USER_CREATE:
          await user.getUserCreate(msg, this.amqp);
          break;
        case MessageType.GET_USER_LOGIN:
          await user.getUserLogin(msg, this.amqp);
          break;
        case MessageType.GET_USER_CHECK_EMAIL:
          await user.getUserCheckEmail(msg, this.amqp);
          break;
        case MessageType.GET_FORGOT_PASSWORD:
          await user.getForgotPassword(msg, this.amqp);
          break;
        case MessageType.GET_CHECK_RESTORE_KEY:
          await user.getCheckRestoreKey(msg, this.amqp);
          break;
        case MessageType.GET_RESTORE_PASSWORD:
          await user.getRestorePassword(msg, this.amqp);
          break;
        case MessageType.GET_CONFIRM_EMAIL:
          await user.getConfirmEmail(msg, this.amqp);
          break;
        default:
          log('warn', 'Default case of consume queue', msg);
      }
    });
  }
}

export default QueueWorker;
