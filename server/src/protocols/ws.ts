import WebSocket, { WebSocketServer } from 'ws';
import {
  LANGUAGE_HEADER,
  LocaleValue,
  LOCALE_DEFAULT,
  MessageType,
  parseQueryString,
  SendMessageArgs,
} from '../types/interfaces';
import { IS_DEV, QUEUE_PREFIX, WS_PORT } from '../utils/constants';
import { checkCors, log } from '../utils/lib';
import Redis from './redis';
import AMQP from './amqp';
import { v4 } from 'uuid';
import QueueHandler from '../services/queueHandler';

const redis = new Redis();

class WS {
  public connection: WebSocket.Server;

  public readonly protocol = 'ws';

  private readonly caller = 'handle-ws';

  public ws: Record<string, WebSocket> = {};

  constructor() {
    this.connection = this.createWSServer();
    this.handleWSConnections();
    this.handleQueues();
  }

  private getQueueName() {
    return `${QUEUE_PREFIX}_${this.protocol}`;
  }

  private handleWSConnections() {
    const amqpS = new AMQP({ caller: this.caller, queue: this.getQueueName() });
    const getConnectionId = (): string => {
      const connId = v4();
      if (this.ws[connId]) {
        return getConnectionId();
      }
      return connId;
    };
    this.connection.on('connection', (ws, { headers, url }) => {
      // const protocol = req.headers['sec-websocket-protocol'];
      const id = getConnectionId();
      if (!checkCors(headers)) {
        ws.send(
          JSON.stringify({
            type: MessageType.SET_ERROR,
            data: {
              message: 'Cross orogin request blocked',
              type: 'warn',
            },
          })
        );
        ws.close();
        return;
      }

      const langM = url?.match(/\?.*/);

      let lang: string | null | undefined = null;
      if (langM) {
        if (langM[0]) {
          const { [LANGUAGE_HEADER]: _lang } = parseQueryString(langM[0]);
          lang = _lang;
        }
      }

      this.setSocket({ id, ws, lang: (lang as LocaleValue) || LOCALE_DEFAULT });

      ws.on('message', async (msg) => {
        const rawMessage = this.parseMessage(msg);
        amqpS.sendToQueue(rawMessage);
      });

      ws.on('close', () => {
        this.deleteSocket(id);
      });
    });
  }

  private async handleQueues() {
    const queue = this.getQueueName();
    const amqpW = new AMQP({ caller: `consumer-${this.protocol}`, queue });
    const queueHandler = new QueueHandler({ ws: this });
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

  public sendMessage<T extends keyof typeof MessageType>(msg: SendMessageArgs<T>) {
    const { id } = msg;
    return new Promise((resolve) => {
      let strMsg = '';
      try {
        strMsg = JSON.stringify(msg);
      } catch (e) {
        log('error', 'Error parse msg on "sendMessage"', { id, msg });
        resolve(1);
      }
      if (!this.ws[id]) {
        log('warn', 'WS user is missing on "sendMessage"', {
          id,
          keys: IS_DEV ? Object.keys(this.ws) : undefined,
        });
        resolve(1);
      }
      this.ws[id]?.send(strMsg, (err) => {
        if (err) {
          resolve(1);
        }
        resolve(0);
      });
    });
  }

  private createWSServer() {
    if (this.connection) {
      return this.connection;
    }
    return new WebSocketServer({ port: WS_PORT });
  }

  public deleteSocket(id: string) {
    delete this.ws[id];
    redis.deleteWS(id);
  }

  public setSocket({ id, ws, lang }: { id: string; ws: WebSocket; lang: LocaleValue }) {
    this.ws[id] = ws;
    redis.setWS(id);
    this.sendMessage({
      id,
      lang,
      timeout: new Date().getTime(),
      type: MessageType.SET_CONNECTION_ID,
      data: null,
    });
  }

  public parseMessage(message: WebSocket.RawData) {
    let _data = '';
    if (typeof message !== 'string') {
      _data = message.toString('utf8');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;
    try {
      data = JSON.parse(_data);
    } catch (err) {
      log('warn', 'Failed parse WS message', _data);
      log('error', 'Error parse WS message', err);
      return null;
    }
    return data;
  }
}

export default WS;
