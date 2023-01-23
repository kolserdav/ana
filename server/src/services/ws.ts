import WebSocket, { WebSocketServer } from 'ws';
import { IS_DEV, WS_PORT } from '../utils/constants';
import { log } from '../utils/lib';

class WS {
  private wss: WebSocket.Server;

  private ws: Record<string, WebSocket> = {};

  constructor() {
    this.wss = this.createWSServer();
  }

  public sendMessage<T>({ id, msg }: { id: string; msg: T }) {
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
    this.wss.on('connection', (e) => {
      console.log(e);
    });
  }
}

export default WS;
