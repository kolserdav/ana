import WebSocket, { WebSocketServer } from 'ws';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { IS_DEV, WS_PORT } from '../utils/constants';
import { log } from '../utils/lib';

class WS {
  public connection: WebSocket.Server;

  public ws: Record<string, WebSocket> = {};

  constructor() {
    this.connection = this.createWSServer();
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

  public setSocket({ id, ws }: { id: string; ws: WebSocket }) {
    this.ws[id] = ws;
    this.sendMessage({
      id,
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
