import { Worker } from 'cluster';
import AMQP from '../protocols/amqp';
import WS from '../protocols/ws';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import Service from './service';
import { Protocol } from '../types';

class QueueMaster extends AMQP {
  private ws: WS | undefined;

  private protocol: Protocol;

  private service: Service;

  constructor({
    ws,
    worker,
    protocol,
  }: {
    protocol: Protocol;
    ws?: WS | undefined;
    worker?: Worker | undefined;
  }) {
    super({ queue: `master-${protocol}` });
    this.protocol = protocol;
    this.ws = ws;
    this.service = new Service(worker);
    this.handleQueues();
  }

  public async testW(msg: SendMessageArgs<MessageType.TEST>) {
    this.service.sendMessageToWorker({
      protocol: this.protocol,
      msg,
    });
  }

  public async test(msg: SendMessageArgs<MessageType.TEST>) {
    this.ws?.sendMessage(msg);
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
    this.consumeMaster();
  }

  public async consumeMaster() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.consume(async (msg: SendMessageArgs<any>) => {
      if (!this.ws) {
        if (!this.service.worker) {
          return;
        }
        this.service.sendMessageToWorker({
          protocol: this.protocol,
          msg,
        });
        return;
      }
      this.ws.sendMessage(msg);
    });
  }
}

export default QueueMaster;
