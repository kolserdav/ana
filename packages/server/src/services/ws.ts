import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { log } from '../utils/lib';
import { ORM } from './orm';
import { CHECK_SERVER_MESSAGES_INTERVAL, WS_PORT } from '../utils/constants';
import { WSMessage, WS_MESSAGE_COMMENT_SERVER_RELOAD } from '../types/interfaces';
import { checkToken } from '../utils/auth';

const server = createServer();
const orm = new ORM();

const CHECK = '+';

class WS {
  server = new WebSocketServer({ server });

  sockets: Record<string, { locale: string; socket: WebSocket; userOnline: string | null }> = {};

  notificated: Record<string, Record<string, typeof CHECK>> = {};

  pushSockets: Record<string, { socket: WebSocket; unitId: string }> = {};

  constructor() {
    this.deleteAllOnline();
    this.deleteServerRebootMessages();

    server.listen(WS_PORT, () => {
      log('info', 'WS server listen at port', WS_PORT, true);
    });

    this.listenServerMessages();
  }

  private async onlineCreate({ id }: { id: string }) {
    const online = await orm.onlineCreate({
      data: {
        id,
      },
    });
    if (!this.sockets[id]) {
      if (online.status !== 'info' || !online.data) {
        return;
      }
      await orm.onlineDelete({
        where: {
          id: online.data.id,
        },
      });
    }
  }

  private async onlineDelete({ id, userOnline }: { id: string; userOnline: string | null }) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const online = await orm.onlineFindFirst({ where: { id } });
        if (online.status === 'info') {
          await orm.onlineDelete({
            where: {
              id,
            },
          });
        }
        if (userOnline) {
          const onlineStatistic = await orm.onlineStatisticFindMany({
            where: {
              id: userOnline,
            },
          });
          if (onlineStatistic.data?.length) {
            await orm.onlineStatisticUpdate({
              where: {
                id: userOnline,
              },
              data: {
                updated: new Date(),
              },
            });
          }
        }
        resolve(0);
      }, 1000);
    });
  }

  public setPushSocket = ({
    connId,
    unitId,
    ws,
  }: {
    connId: string;
    unitId: string;
    ws: WebSocket;
  }) => {
    if (this.pushSockets[connId]) {
      log('warn', 'Duplicate push socket', { connId, unitId });
      return;
    }
    this.pushSockets[connId] = { socket: ws, unitId };
  };

  public deletePushSocket = (connId: string) => {
    if (this.pushSockets[connId]) {
      delete this.pushSockets[connId];
    }
  };

  public async setSocket({
    id,
    locale,
    ws,
    userOnline,
  }: {
    id: string;
    locale: string;
    ws: WebSocket;
    userOnline: string | null;
  }) {
    if (this.sockets[id]) {
      log('warn', 'Duplicate ws socket', id);
      return;
    }

    this.sockets[id] = {
      locale,
      socket: ws,
      userOnline,
    };

    await this.onlineCreate({ id });
  }

  public async setUserId({
    id,
    userId,
    token,
  }: {
    id: string;
    userId: string;
    token: string | undefined;
  }) {
    if (!token) {
      return;
    }

    if (!this.sockets[id]) {
      log('warn', 'Socket not found in setUserId', { id, userId });
      return;
    }
    if (this.sockets[id]?.userOnline) {
      log('warn', 'Duplicate ws sockets.userOnline', id);
      return;
    }

    if (await checkToken(token)) {
      return;
    }

    const userOnline = await orm.onlineStatisticCreate({
      data: {
        userId,
      },
    });

    if (userOnline.status !== 'info' || !userOnline.data) {
      return;
    }

    if (!this.sockets[id]) {
      log('warn', 'Socket is missing after create online statistic', { id });
      await orm.onlineStatisticDelete({
        where: {
          id: userOnline.data.id,
        },
      });
      return;
    }
    this.sockets[id]!.userOnline = userOnline.data.id;
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

    const { userOnline } = this.sockets[id]!;
    delete this.sockets[id];

    this.deleteNotificated(id);

    await this.onlineDelete({ id, userOnline });
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

  public sendMessage(id: string, data: WSMessage, android = false) {
    if (android) {
      const socket = Object.keys(this.pushSockets).find(
        (item) => this.pushSockets[item]?.unitId === id
      );
      if (!socket) {
        log('warn', 'Send message to missing push socket', { id, data });
        return;
      }
      this.pushSockets[socket]?.socket.send(JSON.stringify(data));
      return;
    }
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
