import cluster, { Worker } from 'cluster';

import { MessageType, Protocol, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';
import Service from './service';
import AMQP from '../rabbitmq/amqp';
import { CORS, QUEUE_NAME } from '../utils/constants';
import WS from './ws';
import { v4 } from 'uuid';
import { IncomingMessage } from 'http';

class HandleRequests extends Service {
  private protocol: Protocol;

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

  /**
   * Listen on master
   */
  public async listenWorker() {
    const amqpS = new AMQP({ caller: 'sender', queue: QUEUE_NAME });
    this.listenWorkerMessages<any>(async ({ protocol, msg }) => {
      if (protocol === 'request') {
        amqpS.sendToQueue(msg);
      } else {
        log('warn', 'Unexpected protocol or type', { protocol, type: msg.type });
      }
    });
    this.handleQueues();
  }

  /**
   * Send from worker
   */
  public sendToQueue<T extends keyof typeof MessageType>(msg: SendMessageArgs<T>) {
    this.sendMessageToMaster<T>({ protocol: this.protocol, msg });
  }

  private async handleQueues() {
    const ws = new WS();
    const amqpW = new AMQP({ caller: 'consumer', queue: QUEUE_NAME });
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (amqpW.checkChannel()) {
          clearInterval(interval);
          resolve(0);
        }
      }, 100);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    amqpW.consume((msg: SendMessageArgs<any>) => {
      const { type } = msg;
      switch (type) {
        case MessageType.TEST:
          ws.sendMessage(msg);
          break;
        default:
          log('warn', 'Default case of consume queue', msg);
      }
    });
    this.handleWSConnections({ wss: ws });
  }

  private handleWSConnections({ wss }: { wss: WS }) {
    const getConnectionId = (): string => {
      const connId = v4();
      if (wss.ws[connId]) {
        return getConnectionId();
      }
      return connId;
    };
    wss.connection.on('connection', (ws, req) => {
      // const protocol = req.headers['sec-websocket-protocol'];
      const id = getConnectionId();

      if (!this.checkCors(req)) {
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

      wss.setSocket({ id, ws });

      ws.on('message', (msg) => {
        const rawMessage = wss.parseMessage(msg);
        const { type } = rawMessage;
        switch (type) {
          default:
            log('warn', 'Not implemented WS message', rawMessage);
        }
      });

      ws.on('close', () => {
        wss.deleteSocket(id);
      });
    });
  }

  private checkCors(req: IncomingMessage) {
    const { origin } = req.headers;
    const notAllowed = CORS.split(',').indexOf(origin || '') === -1;
    if (CORS && CORS !== '*' && notAllowed) {
      log('warn', 'Block CORS attempt', { headers: req.headers });
      return false;
    }
    return true;
  }
}

export default HandleRequests;
