import cluster from 'cluster';
import { log } from './utils/lib';
import { ORM } from './services/orm';
import WS from './services/ws';
import { v4 } from 'uuid';
import { WS_MESSAGE_CONN_ID, WS_MESSAGE_LOCALE, parseMessage } from './types/interfaces';

if (cluster.isPrimary) {
  process.setMaxListeners(0);

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
      const { message, data } = rawMessage;
      switch (message) {
        case WS_MESSAGE_LOCALE:
          await ws.setSocket(connId, data, conn);

          ws.sendMessage(connId, {
            type: 'info',
            message: WS_MESSAGE_CONN_ID,
            data: connId,
          });
          break;
        default:
          log('warn', 'Default ws case', rawMessage);
      }

      ws.sendMessage(connId, {
        type: 'info',
        message: WS_MESSAGE_CONN_ID,
        data: connId,
      });
    });

    conn.on('close', async () => {
      await ws.deleteSocket(connId);
    });
  });
}
