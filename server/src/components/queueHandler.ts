import AMQP from '../protocols/amqp';
import Redis from '../protocols/redis';
import WS from '../services/ws';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';

const redis = new Redis();

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
        default:
          log('warn', 'Default case of consume queue', msg);
      }
    });
  }
}

export default QueueHandler;
