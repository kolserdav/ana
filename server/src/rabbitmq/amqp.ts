import amqp from 'amqplib';
import os from 'os';
import { AMQP_ADDRESS, QUEUE_MAX_SIZE } from '../utils/constants';
import { log } from '../utils/lib';

const cpus = os.cpus().length;

class AMQP {
  private connection: amqp.Connection | undefined;

  private channel: amqp.Channel | undefined;

  private caller: string;

  private queue: string;

  private queueIndex: number;

  private readonly connErr = (method: string) => `AMQP connection on method '${method}' is missing`;

  private readonly chanErr = (method: string) => `AMQP channel on method '${method}' is missing`;

  constructor({ caller, queue }: { caller: string; queue: string }) {
    this.caller = caller;
    this.queue = queue;
    this.queueIndex = 0;
    this.createConnection();
  }

  private setQueueIndex() {
    const added = this.queueIndex + 1;
    this.queueIndex = added < cpus ? added : 0;
  }

  private async createConnection() {
    this.connection = await amqp.connect(AMQP_ADDRESS);
    this.connection.on('close', async () => {
      log('warn', 'AMQP connection is closed, reconnecting...');
      await this.closeChannel();
      await this.closeConnection();
      this.clean();
      await this.createConnection();
    });
    await this.createChannel();
    for (let i = 0; i < cpus; i++) {
      await this.assertQueue(this.getQueue(i));
    }
  }

  private clean() {
    this.connection = undefined;
    this.channel = undefined;
  }

  private getQueue(index: number) {
    return `${this.queue}-${index}`;
  }

  public async createChannel() {
    if (!this.connection) {
      log('error', this.connErr('createChannel'), { caller: this.caller });
      return;
    }
    this.channel = await this.connection.createChannel();
  }

  private async closeConnection() {
    if (!this.connection) {
      log('error', this.connErr('closeConnection'), { caller: this.caller });
      return null;
    }
    return this.connection.close();
  }

  private async closeChannel() {
    if (!this.channel) {
      log('error', this.chanErr('closeChannel'), { caller: this.caller });
      return null;
    }
    return this.channel.close();
  }

  private async assertQueue(queue: string) {
    if (!this.channel) {
      log('error', this.chanErr('assertQueue'), { caller: this.caller, queue });
      return null;
    }
    return this.channel.assertQueue(queue, {
      exclusive: false,
      durable: true,
      autoDelete: false,
      arguments: {
        'x-queue-type': 'stream',
        'x-max-length-bytes': QUEUE_MAX_SIZE,
      },
    });
  }

  public async sendToQueue({ queue, msg }: { queue: string; msg: any }) {
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
    const result = this.channel.sendToQueue(this.getQueue(this.queueIndex), Buffer.from(msgString));
    this.setQueueIndex();
    return result;
  }

  public consume<T>(cb: (msg: T) => void) {
    if (!this.channel) {
      log('error', this.chanErr('consume'), { caller: this.caller });
      return;
    }
    for (let i = 0; i < cpus; i++) {
      const queue = this.getQueue(i);
      this.channel.consume(
        queue,
        (msg) => {
          if (!msg) {
            log('log', 'Consume message is missing', { msg, queue, i });
            return;
          }
          const msgStr = msg.content.toString();
          let msgJSON = null;
          try {
            msgJSON = JSON.parse(msgStr);
          } catch (e) {
            log('error', 'Error parse consumed msg', { e, queue, msgStr });
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
            'x-stream-offset': 'first',
          },
        }
      );
    }
  }
}

export default AMQP;
