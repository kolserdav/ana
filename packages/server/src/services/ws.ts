import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { log } from '../utils/lib';
import { ORM } from './orm';
import { WS_PORT } from '../utils/constants';
import { WSMessage } from '../types/interfaces';

const server = createServer();
const orm = new ORM();

class WS {
  server = new WebSocketServer({ server });

  sockets: Record<string, WebSocket> = {};

  constructor() {
    this.deleteAllOnline();

    server.listen(WS_PORT, () => {
      log('info', 'WS server listen at port', WS_PORT, true);
    });
  }

  public async setSocket(id: string, ws: WebSocket) {
    if (this.sockets[id]) {
      log('warn', 'Duplicate ws socket', id);
      return;
    }

    await orm.onlineCreate({
      data: {
        id,
      },
    });

    this.sockets[id] = ws;
  }

  public async deleteSocket(id: string) {
    if (!this.sockets[id]) {
      log('warn', 'Deleted socket is missing', id);
      return;
    }

    await orm.onlineDelete({
      where: {
        id,
      },
    });

    delete this.sockets[id];
  }

  private async deleteAllOnline() {
    const online = await orm.onlineFindMany({});

    online.data.forEach((item) => {
      orm.onlineDelete({
        where: {
          id: item.id,
        },
      });
    });
  }

  public getAllSocketIds() {
    return Object.keys(this.sockets);
  }

  public sendMessage(id: string, data: WSMessage) {
    if (!this.sockets[id]) {
      log('warn', 'Send message to missing socket', { id, data });
      return;
    }
    this.sockets[id]?.send(JSON.stringify(data));
  }
}

export default WS;
