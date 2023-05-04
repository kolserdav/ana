import cluster from 'cluster';
import { log } from './utils/lib';
import { ORM } from './services/orm';
import WS from './services/ws';
import { v4 } from 'uuid';
import { WS_MESSAGE_CONN_ID } from './types/interfaces';

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

    await ws.setSocket(connId, conn);

    ws.sendMessage(connId, {
      type: 'info',
      message: WS_MESSAGE_CONN_ID,
      data: connId,
    });

    conn.on('error', (e) => {
      log('error', 'Error ws connection', e);
    });

    conn.on('message', function message(message) {
      let _data = '';
      if (typeof message !== 'string') {
        _data = message.toString();
      }
      //const rawMessage = ws.parseMessage(_data);
    });

    conn.on('close', async () => {
      await ws.deleteSocket(connId);
    });
  });
}
