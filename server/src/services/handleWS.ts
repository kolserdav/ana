import { IncomingMessage } from 'http';
import { v4 } from 'uuid';
import MessageHandler from '../components/messageHandler';
import { MessageType } from '../types/interfaces';
import { CORS } from '../utils/constants';
import { log } from '../utils/lib';
import WS from './ws';

class HandleWS {
  constructor({ ws }: { ws: WS }) {
    this.handleWSConnections({ ws });
  }

  private handleWSConnections({ ws: wss }: { ws: WS }) {
    const getConnectionId = (): string => {
      const connId = v4();
      if (wss.ws[connId]) {
        return getConnectionId();
      }
      return connId;
    };
    const messageHandler = new MessageHandler({ ws: wss });
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

      messageHandler.messages({ ws });

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

export default HandleWS;
