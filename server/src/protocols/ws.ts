import WebSocket, { WebSocketServer } from 'ws';
import {
  LANGUAGE_HEADER,
  LocaleValue,
  LOCALE_DEFAULT,
  MessageType,
  parseQueryString,
  SendMessageArgs,
} from '../types/interfaces';
import { IS_DEV, WS_PORT } from '../utils/constants';
import { checkCors, log } from '../utils/lib';
import Redis from './redis';
import { v4 } from 'uuid';
import cluster, { Worker } from 'cluster';
import QueueMaster from '../controllers/queueMaster';
import AMQP from './amqp';

const redis = new Redis();
const protocol = 'ws';

class WS {
  public connection: WebSocket.Server | undefined;

  public ws: Record<string, WebSocket> = {};

  public amqpM: QueueMaster | undefined;

  public amqpW: AMQP | undefined;

  constructor(worker: Worker) {
    if (cluster.isPrimary) {
      this.connection = this.createWSServer();
      this.handleWSConnections();
      this.amqpM = new QueueMaster({ protocol, ws: this, worker });
      this.amqpM.handleQueues();
      this.amqpW = new AMQP({ queue: `worker-${protocol}` });
    }
  }

  private handleWSConnections() {
    const getConnectionId = (): string => {
      const connId = v4();
      if (this.ws[connId]) {
        return getConnectionId();
      }
      return connId;
    };
    this.connection?.on('connection', (ws, { headers, url }) => {
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
        this.amqpW?.sendToQueue(rawMessage);
      });

      ws.on('close', () => {
        this.deleteSocket(id);
      });
    });
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
  }

  public setSocket({ id, ws, lang }: { id: string; ws: WebSocket; lang: LocaleValue }) {
    this.ws[id] = ws;
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
