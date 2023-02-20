import AMQP from '../protocols/amqp';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';
import User from '../components/User';
import { Protocol } from '../types';
import { MASTER_QUEUE, WORKER_QUEUE } from '../utils/constants';

const user = new User();

class QueueWorker extends AMQP {
  private protocol: Protocol;

  private amqp: AMQP;

  constructor({ protocol }: { protocol: Protocol }) {
    super({ queue: `${WORKER_QUEUE}-${protocol}` });
    this.amqp = new AMQP({ queue: `${MASTER_QUEUE}-${protocol}` });
    this.protocol = protocol;
    this.handleQueues();
  }

  private async test(msg: SendMessageArgs<MessageType.TEST>) {
    this.amqp.sendToQueue(msg);
  }

  private async handleQueues() {
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

  private async consumeWorker() {
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
        case MessageType.GET_FILE_FIND_MANY:
          await user.getFileFindMany(msg, this.amqp);
          break;
        default:
          log('warn', 'Default case of consume queue', msg);
      }
    });
  }
}

export default QueueWorker;
