import { LANGUAGE_HEADER, MessageType, SendMessageArgs, WSProtocol } from '@/types/interfaces';
import { WS_ADDRESS } from './constants';
import { getLangCookie } from './cookies';
import { log } from './lib';

class WS {
  connection: WebSocket | null = null;

  protocol: WSProtocol;

  constructor({ protocol }: { protocol: WSProtocol }) {
    this.protocol = protocol;
    this.connection = this.createWSConnection();
  }

  private createWSConnection() {
    if (typeof window === 'undefined') {
      return null;
    }
    return new WebSocket(`${WS_ADDRESS}?${LANGUAGE_HEADER}=${getLangCookie()}`, this.protocol);
  }

  public sendMessage = <T extends keyof typeof MessageType>(args: SendMessageArgs<T>) =>
    new Promise((resolve) => {
      let res = '';
      try {
        res = JSON.stringify(args);
      } catch (e) {
        log('error', 'sendMessage', e);
        resolve(1);
      }
      log('log', 'sendMessage', args);
      if (!this.connection) {
        log('error', 'Send message without connection');
        return;
      }
      try {
        this.connection.send(res);
      } catch (e) {
        log('error', 'Error send message', e);
        resolve(1);
      }
      resolve(0);
    });

  public parseMessage(message: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: SendMessageArgs<any>;
    try {
      data = JSON.parse(message);
    } catch (err) {
      log('error', 'Error parse WS message', err);
      return null;
    }
    return data;
  }
}

export default WS;
