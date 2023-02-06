import amqp from 'amqplib';
import { Worker } from 'cluster';
import os from 'os';
import QueueHandler from '../services/queueHandler';
import { Protocol } from '../types';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { AMQP_ADDRESS, QUEUE_MAX_SIZE, RABBITMQ_RECONNECT_TIMEOUT } from '../utils/constants';
import { log, wait } from '../utils/lib';

const cpus = os.cpus().length;

class AMQP {
  private connection: amqp.Connection | undefined | void;

  private channel: amqp.Channel | undefined;

  private caller: boolean;

  private queue: string;

  private queueIndex: number;

  private readonly connErr = (method: string) => `AMQP connection on method '${method}' is missing`;

  private readonly chanErr = (method: string) => `AMQP channel on method '${method}' is missing`;

  constructor({ caller, queue }: { caller: boolean; queue: string }) {
    this.caller = caller;
    this.queue = queue;
    this.queueIndex = 0;
    this.createConnection();
  }

  private setQueueIndex() {
    const added = this.queueIndex + 1;
    this.queueIndex = added < cpus ? added : 0;
  }

  private async createConnection(): Promise<void> {
    this.connection = await amqp.connect(AMQP_ADDRESS).catch((e) => {
      log('error', 'Failed RabbitMQ connection', e);
    });
    if (!this.connection) {
      this.clean();
      await wait(RABBITMQ_RECONNECT_TIMEOUT);
      return await this.createConnection();
    }

    this.connection.on('close', async () => {
      log('warn', 'AMQP connection is closed, reconnecting...');
      this.clean();
      await wait(RABBITMQ_RECONNECT_TIMEOUT);
      return await this.createConnection();
    });

    await this.createChannel();
    await this.assertQueue(this.getQueue());
  }

  private clean() {
    this.connection = undefined;
    this.channel = undefined;
  }

  private getQueue() {
    return this.queue;
  }

  private async createChannel() {
    if (!this.connection) {
      log('error', this.connErr('createChannel'), { caller: this.caller });
      return;
    }
    this.channel = await this.connection.createChannel();
  }

  public checkChannel() {
    return this.channel !== undefined;
  }

  private async assertQueue(queue: string) {
    if (!this.channel) {
      log('error', this.chanErr('assertQueue'), { caller: this.caller, queue });
      return null;
    }
    const result = await this.channel.assertQueue(queue, {
      exclusive: false,
      durable: true,
      autoDelete: false,
      arguments: {
        'x-queue-type': 'classic',
        'x-max-length-bytes': QUEUE_MAX_SIZE,
      },
    });
    return result;
  }

  public async handleQueues(protocol: Protocol, worker?: Worker) {
    const queueHandler = new QueueHandler({ worker, protocol });
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.checkChannel()) {
          clearInterval(interval);
          resolve(0);
        }
      }, 100);
    });
    queueHandler.consumeCaller({ amqp: this });
  }

  public async sendToQueue(msg: SendMessageArgs<any>) {
    if (!this.channel) {
      log('error', this.chanErr('sendToQueue'), { caller: this.caller });
      return null;
    }
    let msgString = '';
    try {
      msgString = JSON.stringify(msg);
    } catch (e) {
      log('error', 'Error stringify msg', { e, msg });
    }
    const result = this.channel.sendToQueue(this.getQueue(), Buffer.from(msgString));
    this.setQueueIndex();
    return result;
  }

  // eslint-disable-next-line no-unused-vars
  public consume<T extends keyof typeof MessageType>(cb: (msg: SendMessageArgs<T>) => void) {
    if (!this.channel) {
      log('error', this.chanErr('consume'), { caller: this.caller });
      return;
    }
    const queue = this.getQueue();
    this.channel.consume(
      queue,
      (msg) => {
        if (!msg) {
          log('log', 'Consume message is missing', { msg, queue });
          return;
        }
        const msgStr = msg.content.toString();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let msgJSON: null | SendMessageArgs<any> = null;
        try {
          msgJSON = JSON.parse(msgStr);
        } catch (e) {
          log('error', 'Error parse consumed msg', { e, queue, msgStr });
          return;
        }
        if (msgJSON === null) {
          return;
        }
        cb(msgJSON);
        if (!this.channel) {
          log('error', this.chanErr('consumeCallback'), { caller: this.caller });
          return;
        }
        this.channel.ack(msg);
      },
      {
        noAck: false,
        arguments: {
          'x-classic-offset': 'first',
        },
      }
    );
  }
}

export default AMQP;
