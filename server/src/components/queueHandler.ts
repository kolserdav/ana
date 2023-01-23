import AMQP from '../rabbitmq/amqp';
import WS from '../services/ws';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';

class QueueHandler {
  private ws: WS;

  constructor({ ws }: { ws: WS }) {
    this.ws = ws;
  }

  public test(msg: SendMessageArgs<MessageType.TEST>) {
    this.ws.sendMessage(msg);
  }

  public async queues({ amqp }: { amqp: AMQP }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    amqp.consume((msg: SendMessageArgs<any>) => {
      const { type } = msg;
      switch (type) {
        case MessageType.TEST:
          this.test(msg);
          break;
        default:
          log('warn', 'Default case of consume queue', msg);
      }
    });
  }
}

export default QueueHandler;
