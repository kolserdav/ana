import cluster, { Worker } from 'cluster';
import EventEmitter from 'events';
import { Message, ProcessMessage, SendProcessMessageArgs } from '../types';

class Service extends EventEmitter {
  private readonly workerNotFound = 'Worker not found in Service';

  private readonly masterNotFound = 'Master not found in Service';

  private readonly unexpectedUseProcess = 'Unexpected use process';

  protected worker: Worker | undefined;

  constructor(_worker?: Worker) {
    super();
    this.worker = _worker;
  }

  protected listenMasterMessages<T extends keyof typeof ProcessMessage>(
    cb: (data: Message<T>) => void
  ) {
    if (!process) {
      throw new Error(this.workerNotFound);
    }
    if (cluster.isPrimary) {
      throw new Error(`${this.unexpectedUseProcess}: worker`);
    }
    process.on('message', (data) => {
      cb(data as any);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  protected listenWorkerMessages<T extends keyof typeof ProcessMessage>(
    cb: (args: Message<T>) => void
  ) {
    if (!this.worker) {
      throw new Error(this.workerNotFound);
    }
    if (!cluster.isPrimary) {
      throw new Error(`${this.unexpectedUseProcess}: master`);
    }
    const handler = (data: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _data: Message<any> = data as any;
      cb(_data);
    };
    const worker = this.worker.on('message', handler);
    return { worker, handler };
  }

  protected sendMessageToWorker<T extends keyof typeof ProcessMessage>({
    protocol,
    msg,
  }: Message<T>) {
    if (!this.worker) {
      throw new Error(this.workerNotFound);
    }
    if (!cluster.isPrimary) {
      throw new Error(`${this.unexpectedUseProcess}: master`);
    }
    this.worker.send({ msg, protocol });
  }

  protected sendMessageToMaster<T extends keyof typeof ProcessMessage>({
    protocol,
    msg,
  }: Message<T>) {
    if (!process.send) {
      throw new Error(this.masterNotFound);
    }
    if (cluster.isPrimary) {
      throw new Error(`${this.unexpectedUseProcess}: worker`);
    }
    process.send({ msg, protocol });
  }
}

export default Service;
