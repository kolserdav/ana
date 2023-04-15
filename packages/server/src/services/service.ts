import cluster, { Worker } from 'cluster';
import EventEmitter from 'events';

class Service extends EventEmitter {
  private readonly workerNotFound = 'Worker not found in Service';

  private readonly masterNotFound = 'Master not found in Service';

  private readonly unexpectedUseProcess = 'Unexpected use process';

  public worker: Worker | undefined;

  constructor(_worker?: Worker) {
    super();
    this.worker = _worker;
  }

  protected listenMasterMessages(
    // eslint-disable-next-line no-unused-vars
    cb: (data: any) => void
  ) {
    if (!process) {
      throw new Error(this.workerNotFound);
    }
    if (cluster.isPrimary) {
      throw new Error(`${this.unexpectedUseProcess}: worker`);
    }
    const handler = (data: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cb(data as any);
    };
    const master = process.on('message', handler);
    return { master, handler };
  }

  // eslint-disable-next-line class-methods-use-this
  protected listenWorkerMessages(
    // eslint-disable-next-line no-unused-vars
    cb: (args: any) => void
  ) {
    if (!this.worker) {
      throw new Error(this.workerNotFound);
    }
    if (!cluster.isPrimary) {
      throw new Error(`${this.unexpectedUseProcess}: master`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (data: any) => {
      cb(data);
    };
    const worker = this.worker.on('message', handler);
    return { worker, handler };
  }

  public sendMessageToWorker(data: any) {
    if (!this.worker) {
      throw new Error(this.workerNotFound);
    }
    if (!cluster.isPrimary) {
      throw new Error(`${this.unexpectedUseProcess}: master`);
    }
    this.worker.send(data);
  }

  protected sendMessageToMaster(data: any) {
    if (!process.send) {
      throw new Error(this.masterNotFound);
    }
    if (cluster.isPrimary) {
      throw new Error(`${this.unexpectedUseProcess}: worker`);
    }
    process.send(data);
  }
}

export default Service;
