import { WebSocket } from 'ws';
import HandleRequests from '../services/handleRequests';
import WS from '../services/ws';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { log } from '../utils/lib';

const protocol = 'ws';
const handleRequests = new HandleRequests({ protocol, caller: 'message-handler' });

class MessageHandler {
  private ws: WS;

  constructor({ ws }: { ws: WS }) {
    this.ws = ws;
  }

  private async test(msg: SendMessageArgs<MessageType.TEST>) {
    handleRequests.emit('message', { protocol, msg });
  }

  private async getUserCheckEmail(msg: SendMessageArgs<MessageType.GET_USER_CHECK_EMAIL>) {
    handleRequests.emit('message', { protocol, msg });
  }

  public messages({ ws }: { ws: WebSocket }) {
    ws.on('message', async (msg) => {
      const rawMessage = this.ws.parseMessage(msg);
      const { type } = rawMessage;
      switch (type) {
        case MessageType.TEST:
          await this.test(rawMessage);
          break;
        case MessageType.GET_USER_CHECK_EMAIL:
          await this.getUserCheckEmail(rawMessage);
          break;
        default:
          log('warn', 'Not implemented WS message', rawMessage);
      }
    });
  }
}

export default MessageHandler;
