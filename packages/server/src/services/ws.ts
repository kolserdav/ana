import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { log } from '../utils/lib';
import { ORM } from './orm';
import { CHECK_SERVER_MESSAGES_INTERVAL, WS_PORT } from '../utils/constants';
import { WSMessage, WS_MESSAGE_COMMENT_SERVER_RELOAD } from '../types/interfaces';

const server = createServer();
const orm = new ORM();

const CHECK = '+';

class WS {
  server = new WebSocketServer({ server });

  sockets: Record<string, { locale: string; socket: WebSocket }> = {};

  notificated: Record<string, Record<string, typeof CHECK>> = {};

  constructor() {
    this.deleteAllOnline();
    this.deleteServerRebootMessages();

    server.listen(WS_PORT, () => {
      log('info', 'WS server listen at port', WS_PORT, true);
    });

    this.listenServerMessages();
  }

  public async setSocket(id: string, locale: string, ws: WebSocket) {
    if (this.sockets[id]) {
      log('warn', 'Duplicate ws socket', id);
      return;
    }

    await orm.onlineCreate({
      data: {
        id,
      },
    });

    this.sockets[id] = {
      locale,
      socket: ws,
    };
  }

  private async deleteServerRebootMessages() {
    const sm = await orm.serverMessageFindMany({
      where: {
        comment: WS_MESSAGE_COMMENT_SERVER_RELOAD,
      },
    });

    const res = await orm.serverMessageDeleteMany({
      where: {
        OR: sm.data.map((item) => ({
          id: item.id,
        })),
      },
    });
    if (res === null) {
      return;
    }
    if (res.data.length) {
      log('info', 'Notifications to reload deleted:', res.data, true);
    }
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

    this.deleteNotificated(id);
  }

  private deleteNotificated(id: string) {
    this.getNotificatedKeys().forEach((item) => {
      if (!this.notificated[item]) {
        log('warn', 'Notificated object for delete is missing', item);
        return;
      }
      Object.keys(this.notificated[item]!).forEach((_item) => {
        if (!this.notificated[item]![_item]) {
          log('warn', 'Deleted notificated is missing', _item);
          return;
        }
        if (_item === id) {
          delete this.notificated[item]![_item];
        }
      });
    });
  }

  private getNotificatedKeys() {
    return Object.keys(this.notificated);
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
    this.sockets[id]?.socket.send(JSON.stringify(data));
  }

  private listenServerMessages() {
    setInterval(async () => {
      const sm = await orm.serverMessageFindMany({});
      const sockets = this.getAllSocketIds();

      const notifToDelete = this.getNotificatedKeys();
      sm.data.forEach((item) => {
        const index = notifToDelete.indexOf(item.id);
        if (index !== -1) {
          notifToDelete.splice(index, 1);
        }

        if (!this.notificated[item.id]) {
          this.notificated[item.id] = {};
        }

        sockets.map((_item) => {
          if (!this.notificated[item.id]) {
            return;
          }

          if (
            item.lang === this.sockets[_item]?.locale &&
            this.notificated[item.id]![_item] !== CHECK
          ) {
            this.sendMessage(_item, {
              type: item.type,
              message: item.text,
              data: WS_MESSAGE_COMMENT_SERVER_RELOAD,
              forUser: true,
              infinity: true,
            });
            this.notificated[item.id]![_item] = CHECK;
          }
        });
      });

      notifToDelete.forEach((item) => {
        delete this.notificated[item];
      });
    }, CHECK_SERVER_MESSAGES_INTERVAL);
  }
}

export default WS;
