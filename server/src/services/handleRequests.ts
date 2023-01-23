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

  constructor(protocol: Protocol, ws?: WS, worker?: Worker) {
    let _worker = worker;
    if (!_worker && cluster.isPrimary) {
      const { workers } = cluster;
      if (workers) {
        // eslint-disable-next-line prefer-destructuring
        _worker = (workers as Record<number, Worker>)[1];
      } else {
        log('warn', 'Workers not found', { err: new Error() });
      }
    }
    super(_worker);

    this.protocol = protocol;

    if (_worker && ws) {
      this.listenWorker();
      this.handleQueues({ ws });
    } else if ((worker && !ws) || (ws && !_worker)) {
      log('warn', 'Worker and WS must be together on "HandleRequests" constructor', { __filename });
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
    console.log(queue);
    queueHandler.queues({ amqp: amqpW });
  }

  /**
   * Listen on master
   */
  public async listenWorker() {
    const amqpS = new AMQP({ caller: 'sender-w', queue: this.getQueueName() });
    this.listenWorkerMessages<any>(async ({ protocol, msg }) => {
      if (protocol === 'request' || protocol === 'ws') {
        amqpS.sendToQueue(msg);
      } else {
        log('warn', 'Unexpected protocol or type', { protocol, type: msg.type });
      }
    });
  }

  /**
   * Send from worker
   */
  public sendToQueue<T extends keyof typeof MessageType>(msg: SendMessageArgs<T>) {
    this.sendMessageToMaster<T>({ protocol: this.protocol, msg });
  }
}

export default HandleRequests;
