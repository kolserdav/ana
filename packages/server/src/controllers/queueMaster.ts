import { Worker } from 'cluster';
import AMQP from '../protocols/amqp';
import WS from '../protocols/ws';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import Service from '../services/service';
import { Protocol } from '../types';
import { MASTER_QUEUE } from '../utils/constants';
import { log } from '../utils/lib';
import Project from '../components/Project';

const project = new Project();

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
    ws: WS | undefined;
    worker: Worker | undefined;
  }) {
    super({ queue: `${MASTER_QUEUE}-${protocol}` });
    this.protocol = protocol;
    this.ws = ws;
    this.service = new Service(worker);
    this.handleQueues();
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
      if (this.protocol === 'request') {
        if (!this.service.worker) {
          return;
        }

        if (this.ws) {
          const { type } = msg;
          switch (type) {
            case MessageType.SET_POST_PROJECT_MESSAGE:
              project.sendWSNotification(msg, this.ws);
              break;
            default:
          }
        }

        this.service.sendMessageToWorker({
          protocol: this.protocol,
          msg,
        });
        return;
      }
      if (this.ws) {
        this.ws.sendMessage(msg);
      } else {
        log('error', 'WS is missing in consumeMaster', { err: new Error(), msg });
      }
    });
  }
}

export default QueueMaster;
