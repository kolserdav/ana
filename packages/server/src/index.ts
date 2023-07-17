import cluster from 'cluster';
import { log } from './utils/lib';
import { ORM } from './services/orm';
import WS from './services/ws';
import { v4 } from 'uuid';
import {
  WS_MESSAGE_CONN_ID,
  WS_MESSAGE_LOCALE,
  WS_MESSAGE_USER_ID,
  parseMessage,
} from './types/interfaces';
import Tasks from './services/tasks';
import { WS_MESSAGE_NOTIFICATION_USER_ID } from './utils/constants';
process.setMaxListeners(0);
if (cluster.isPrimary) {
  process.on('uncaughtException', (err: Error) => {
    log('error', '[MASTER] uncaughtException', err);
  });
  process.on('unhandledRejection', (err: Error) => {
    log('error', '[MASTER] unhandledRejection', err);
  });

  const worker = cluster.fork();
  new ORM(worker);
} else {
  import('./http');

  const ws = new WS();

  new Tasks(ws);

  ws.server.on('connection', async (conn) => {
    const connId = v4();

    conn.on('error', (e) => {
      log('error', 'Error ws connection', e);
    });

    conn.on('message', async (msg) => {
      let _data = '';
      if (typeof msg !== 'string') {
        _data = msg.toString();
      }
      const rawMessage = parseMessage(_data);
      if (!rawMessage) {
        return;
      }
      const { message, data, token } = rawMessage;
      switch (message) {
        case WS_MESSAGE_LOCALE:
          await ws.setSocket({ id: connId, locale: data, ws: conn, userOnline: null });
          ws.sendMessage(connId, {
            type: 'info',
            message: WS_MESSAGE_CONN_ID,
            data: connId,
          });
          break;
        case WS_MESSAGE_USER_ID:
          await ws.setUserId({ id: connId, userId: data, token });
          break;
        case WS_MESSAGE_NOTIFICATION_USER_ID:
          ws.setPushSocket({ ws: conn, unitId: data, connId });
          break;
        default:
          log('warn', 'Default ws case', rawMessage);
      }
    });

    conn.on('close', async () => {
      ws.deletePushSocket(connId);
      await ws.deleteSocket(connId);
    });
  });
}
