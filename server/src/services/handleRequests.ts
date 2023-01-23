import cluster, { Worker } from 'cluster';
import { Protocol } from '../types/interfaces';
import { log } from '../utils/lib';
import Service from './service';
import AMQP from '../rabbitmq/amqp';
import { QUEUE_NAME } from '../utils/constants';

const amqpS = new AMQP({ caller: 'sender', queue: QUEUE_NAME });
const amqpW = new AMQP({ caller: 'consumer', queue: QUEUE_NAME });

class HandleRequests extends Service {
  private protocol: Protocol;

  private started = false;

  constructor(protocol: Protocol, worker?: Worker) {
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
  }

  public async listenWorker() {
    this.listenWorkerMessages<any>(async ({ protocol, msg }) => {
      if (protocol === 'request') {
        this.started = true;
        amqpS.sendToQueue(msg);
      } else {
        log('warn', 'Unexpected protocol or type', { protocol, type: msg.type });
      }
    });
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.started) {
          clearInterval(interval);
          resolve(0);
        }
      }, 100);
    });
    this.handleQueues();
  }

  private handleQueues() {
    amqpW.consume((msg) => {
      console.log(msg);
    });
  }

  public sendToQueue(msg: any) {
    this.sendMessageToMaster<any>({ protocol: this.protocol, msg });
  }
}

export default HandleRequests;
