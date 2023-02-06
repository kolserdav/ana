import cluster, { Worker } from 'cluster';

import { MessageType, SendMessageArgs } from '../types/interfaces';
import Service from './service';
import AMQP from '../protocols/amqp';
import { QUEUE_PREFIX } from '../utils/constants';
import QueueHandler from './queueHandler';
import { Message } from 'amqplib';
import { ProcessMessage } from '../types';

class HandleRequests extends Service {
  private readonly caller = 'handle-request';

  private readonly protocol = 'request';

  constructor({ worker }: { worker?: Worker }) {
    super(worker);

    if (cluster.isPrimary) {
      this.listenWorker();
      this.handleQueues(worker);
    }
  }

  private getQueueName() {
    return `${QUEUE_PREFIX}_${this.protocol}`;
  }

  private async handleQueues(worker?: Worker) {
    const queue = this.getQueueName();
    const amqpW = new AMQP({ caller: `consumer-${this.protocol}`, queue });
    const queueHandler = new QueueHandler({ worker, protocol: this.protocol });
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (amqpW.checkChannel()) {
          clearInterval(interval);
          resolve(0);
        }
      }, 100);
    });
    queueHandler.queues({ amqp: amqpW });
  }

  public async listenWorker() {
    const amqpS = new AMQP({ caller: this.caller, queue: this.getQueueName() });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.listenWorkerMessages<any>(async ({ protocol, msg }) => {
      if (protocol === this.protocol) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        amqpS.sendToQueue(msg as any);
      }
    });
  }

  public sendToQueue<T extends keyof typeof MessageType>(
    msg: SendMessageArgs<T>
  ): Promise<ProcessMessage<T>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = new Promise<ProcessMessage<any>>((resolve) => {
      const { master, handler } = this.listenMasterMessages((_msg) => {
        if (_msg.protocol === this.protocol && _msg.msg.id === msg.id) {
          master.removeListener('message', handler);
          resolve(_msg);
        }
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.sendMessageToMaster<any>({ protocol: this.protocol, msg: msg as any });
    return res;
  }
}

export default HandleRequests;
