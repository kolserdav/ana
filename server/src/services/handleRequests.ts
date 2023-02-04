import cluster, { Worker } from 'cluster';

import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';
import Service from './service';
import AMQP from '../protocols/amqp';
import { QUEUE_PREFIX } from '../utils/constants';
import WS from './ws';
import QueueHandler from '../components/queueHandler';
import { DatabaseContext, Protocol } from '../types';

class HandleRequests extends Service {
  private protocol: Protocol;

  private caller: string;

  constructor({
    protocol,
    ws,
    worker,
    caller,
  }: {
    protocol: Protocol;
    caller: string;
    ws?: WS;
    worker?: Worker;
  }) {
    super(worker);

    this.protocol = protocol;
    this.caller = caller;

    if (cluster.isPrimary) {
      switch (protocol) {
        case 'request':
          if (ws && worker) {
            this.listenWorker();
          }
          break;
        case 'ws':
          if (!ws && !worker) {
            this.listenMaster();
          }
          break;
        default:
          log('warn', 'Default case of "Handle Requests" protocol', protocol);
      }
      if (ws && worker) {
        this.handleQueues({ ws });
      }
      if ((worker && !ws) || (ws && !worker)) {
        log('warn', 'Worker and WS must be together on "HandleRequests" constructor', {
          __filename,
        });
      }
    }
  }

  private getQueueName() {
    return `${QUEUE_PREFIX}_${this.protocol}`;
  }

  private async handleQueues({ ws }: { ws: WS }) {
    const queue = this.getQueueName();
    const amqpW = new AMQP({ caller: 'consumer', queue });
    const queueHandler = new QueueHandler({ ws });
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
      if (protocol === 'request') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        amqpS.sendToQueue(msg as any);
      }
    });
  }

  public async listenMaster() {
    const amqpS = new AMQP({ caller: this.caller, queue: this.getQueueName() });
    this.addListener('message', ({ protocol, msg }) => {
      if (protocol === 'ws') {
        amqpS.sendToQueue(msg);
      }
    });
  }

  public sendToQueue<T extends keyof typeof MessageType>(
    msg: SendMessageArgs<T>,
    context: DatabaseContext
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.sendMessageToMaster<any>({ protocol: this.protocol, msg: msg as any, context });
  }
}

export default HandleRequests;
