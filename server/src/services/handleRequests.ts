import cluster, { Worker } from 'cluster';

import { MessageType, Protocol, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';
import Service from './service';
import AMQP from '../rabbitmq/amqp';
import { QUEUE_PREFIX } from '../utils/constants';
import WS from './ws';
import QueueHandler from '../components/queueHandler';

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
    this.listenWorkerMessages<any>(async ({ protocol, msg }) => {
      if (protocol === 'request') {
        amqpS.sendToQueue(msg);
      } else {
        log('warn', 'Unexpected protocol or type on "listenWorker"', { protocol, type: msg.type });
      }
    });
  }

  public async listenMaster() {
    const amqpS = new AMQP({ caller: this.caller, queue: this.getQueueName() });
    this.addListener('message', ({ protocol, msg }) => {
      if (protocol === 'ws') {
        amqpS.sendToQueue(msg);
      } else {
        log('warn', 'Unexpected protocol or type on "listenMaster"', { protocol, type: msg.type });
      }
    });
  }

  public sendToQueue<T extends keyof typeof MessageType>(msg: SendMessageArgs<T>) {
    this.sendMessageToMaster<T>({ protocol: this.protocol, msg });
  }
}

export default HandleRequests;
