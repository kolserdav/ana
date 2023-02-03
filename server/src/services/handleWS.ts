import { v4 } from 'uuid';
import MessageHandler from '../components/messageHandler';
import {
  LOCALE_DEFAULT,
  LANGUAGE_HEADER,
  LocaleValue,
  MessageType,
  parseQueryString,
} from '../types/interfaces';
import { checkCors } from '../utils/lib';
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
    wss.connection.on('connection', (ws, { headers, url }) => {
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

      wss.setSocket({ id, ws, lang: (lang as LocaleValue) || LOCALE_DEFAULT });

      messageHandler.messages({ ws });

      ws.on('close', () => {
        wss.deleteSocket(id);
      });
    });
  }
}

export default HandleWS;
