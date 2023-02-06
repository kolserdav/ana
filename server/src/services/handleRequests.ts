import cluster, { Worker } from 'cluster';

import { MessageType, SendMessageArgs } from '../types/interfaces';
import Service from './service';
import AMQP from '../protocols/amqp';

const protocol = 'request';
const amqp = new AMQP({ caller: true, queue: `caller-${protocol}` });

class HandleRequests extends Service {
  private readonly caller = 'handle-request';

  constructor({ worker }: { worker?: Worker }) {
    super(worker);

    if (cluster.isPrimary) {
      this.listenWorker();
      amqp.handleQueues(protocol, worker);
    }
  }

  public async listenWorker() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.listenWorkerMessages<any>(async ({ protocol: _protocol, msg }) => {
      if (protocol === _protocol) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        amqp.sendToQueue(msg as any);
      }
    });
  }

  public sendToQueue<
    T extends keyof typeof MessageType,
    K extends keyof typeof MessageType = keyof typeof MessageType
  >(msg: SendMessageArgs<K>): Promise<SendMessageArgs<T>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = new Promise<SendMessageArgs<any>>((resolve) => {
      const { master, handler } = this.listenMasterMessages((_msg) => {
        if (_msg.protocol === protocol && _msg.msg.id === msg.id) {
          master.removeListener('message', handler);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          _msg.msg.type = msg.type.replace(/^G/, 'S') as any;
          resolve({
            lang: msg.lang,
            timeout: msg.timeout,
            ..._msg.msg,
          });
        }
      });
    });
    this.sendMessageToMaster<K>({ protocol, msg });
    return res;
  }
}

export default HandleRequests;
