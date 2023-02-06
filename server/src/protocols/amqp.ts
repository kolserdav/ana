import amqp from 'amqplib';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { AMQP_ADDRESS, QUEUE_MAX_SIZE, RABBITMQ_RECONNECT_TIMEOUT } from '../utils/constants';
import { log, wait } from '../utils/lib';

class AMQP {
  private connection: amqp.Connection | undefined | void;

  private channel: amqp.Channel | undefined;

  public queue: string;

  private readonly connErr = (method: string) => `AMQP connection on method '${method}' is missing`;

  private readonly chanErr = (method: string) => `AMQP channel on method '${method}' is missing`;

  constructor({ queue }: { queue: string }) {
    this.queue = queue;
    this.createConnection();
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
    await this.assertQueue();
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
      log('error', this.connErr('createChannel'), { queue: this.queue });
      return;
    }
    this.channel = await this.connection.createChannel();
  }

  public checkChannel() {
    return this.channel !== undefined;
  }

  private async assertQueue() {
    if (!this.channel) {
      log('error', this.chanErr('assertQueue'), { queue: this.queue });
      return null;
    }
    const result = await this.channel.assertQueue(this.queue, {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendToQueue(msg: SendMessageArgs<any>) {
    if (!this.channel) {
      log('error', this.chanErr('sendToQueue'), { queue: this.queue });
      return null;
    }
    let msgString = '';
    try {
      msgString = JSON.stringify(msg);
    } catch (e) {
      log('error', 'Error stringify msg', { e, msg });
    }
    log('log', 'Send to queue', { msg, queue: this.queue });
    const result = this.channel.sendToQueue(this.getQueue(), Buffer.from(msgString));
    return result;
  }

  // eslint-disable-next-line no-unused-vars
  public consume<T extends keyof typeof MessageType>(cb: (msg: SendMessageArgs<T>) => void) {
    if (!this.channel) {
      log('error', this.chanErr('consume'), { queue: this.queue });
      return;
    }
    this.channel.consume(
      this.queue,
      (msg) => {
        if (!msg) {
          log('log', 'Consume message is missing', { msg, queue: this.queue });
          return;
        }
        const msgStr = msg.content.toString();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let msgJSON: null | SendMessageArgs<any> = null;
        try {
          msgJSON = JSON.parse(msgStr);
        } catch (e) {
          log('error', 'Error parse consumed msg', { e, queue: this.queue, msgStr });
          return;
        }
        if (msgJSON === null) {
          return;
        }
        cb(msgJSON);
        if (!this.channel) {
          log('error', this.chanErr('consumeCallback'), { queue: this.queue });
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
