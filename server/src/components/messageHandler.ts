import { WebSocket } from 'ws';
import HandleRequests from '../services/handleRequests';
import WS from '../services/ws';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';

class MessageHandler {
  private ws: WS;

  constructor({ ws }: { ws: WS }) {
    this.ws = ws;
  }

  private async test(msg: SendMessageArgs<MessageType.TEST>) {
    this.ws.sendMessage(msg);
  }

  public messages({ ws }: { ws: WebSocket }) {
    ws.on('message', async (msg) => {
      const rawMessage = this.ws.parseMessage(msg);
      const { type } = rawMessage;
      switch (type) {
        case MessageType.TEST:
          await this.test(rawMessage);
          break;
        default:
          log('warn', 'Not implemented WS message', rawMessage);
      }
    });
  }
}

export default MessageHandler;
