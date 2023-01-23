import WebSocket, { WebSocketServer } from 'ws';
import { v4 } from 'uuid';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { CORS, IS_DEV, WS_PORT } from '../utils/constants';
import { log } from '../utils/lib';

class WS {
  private wss: WebSocket.Server;

  private ws: Record<string, WebSocket> = {};

  constructor() {
    this.wss = this.createWSServer();
    this.handleWSConnections();
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
    if (this.wss) {
      return this.wss;
    }
    return new WebSocketServer({ port: WS_PORT });
  }

  public handleWSConnections() {
    const getConnectionId = (): string => {
      const connId = v4();
      if (this.ws[connId]) {
        return getConnectionId();
      }
      return connId;
    };
    this.wss.on('connection', (ws, req) => {
      const { origin } = req.headers;
      const protocol = req.headers['sec-websocket-protocol'];
      const notAllowed = CORS.split(',').indexOf(origin || '') === -1;
      const id = getConnectionId();
      if (CORS && CORS !== '*' && notAllowed) {
        const message = 'Block CORS attempt';
        log('warn', message, { headers: req.headers });
        ws.send(
          JSON.stringify({
            type: MessageType.SET_ERROR,
            data: {
              message,
              type: 'warn',
            },
          })
        );
        ws.close();
        return;
      }

      this.setSocket({ id, ws });

      ws.on('message', (msg) => {
        const rawMessage = this.parseMessage(msg);
        const { type } = rawMessage;
        switch (type) {
          default:
            log('warn', 'Not implemented WS message', rawMessage);
        }
      });

      ws.on('close', () => {
        this.deleteSocket(id);
      });
    });
  }

  private deleteSocket(id: string) {
    delete this.ws[id];
  }

  private setSocket({ id, ws }: { id: string; ws: WebSocket }) {
    this.ws[id] = ws;
    this.sendMessage({
      id,
      type: MessageType.SET_CONNECTION_ID,
      data: null,
    });
  }

  private parseMessage(message: WebSocket.RawData) {
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
