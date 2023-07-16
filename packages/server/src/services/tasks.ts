import { spawn } from 'child_process';
import { TRANSLATE_SERVICE_UNAVAILABLE_COMMENT } from '../types/interfaces';
import {
  ADMIN_EMAIL,
  CHECK_TRANSLATE_SERVICE_TIMEOUT,
  SCRIPT_FILE_SERVER_MESSAGES,
  TRANSLATE_URL,
  NODE_ENV,
  CHECK_PUSH_NOTIFICATION_INTERVAL,
  PUSH_NOTIFICATION_MAX_TIME,
  PUSH_NOTIFICATION_MIN_TIME,
} from '../utils/constants';
import { sendEmail } from '../utils/email';
import { ORM } from './orm';
import { log } from 'console';
import path from 'path';
import { ScriptServerMessagesArgName } from '../types';
import WS from './ws';

const orm = new ORM();

class Tasks {
  cwd = process.cwd();

  ws: WS;

  constructor(_ws: WS) {
    this.ws = _ws;

    if (NODE_ENV !== 'development') {
      this.checkTranslateService();
    }

    this.sendPushNotifications();
  }

  private sendPushNotifications() {
    const getPushTimeZones = () => {
      const date = new Date();
      const hours = date.getHours();
      //const hours = 5;
      const lte = hours - PUSH_NOTIFICATION_MIN_TIME;
      const gt = lte - (PUSH_NOTIFICATION_MAX_TIME - PUSH_NOTIFICATION_MIN_TIME);
      return { lte, gt };
    };

    setInterval(async () => {
      const { gt, lte } = getPushTimeZones();

      const dateDay = new Date();
      dateDay.setHours(dateDay.getHours() - 12);

      const usersForNotification = await orm.userFindMany({
        where: {
          AND: [
            {
              timeZone: {
                not: null,
              },
            },
            {
              timeZone: {
                lte,
                gt,
              },
            },
            {
              OR: [
                {
                  PushNotificationUser: {
                    every: {
                      created: {
                        lt: dateDay,
                      },
                    },
                  },
                },
                {
                  PushNotificationUser: {
                    some: {},
                  },
                },
              ],
            },
            {
              OnlineStatistic: {
                every: {
                  created: {
                    lt: dateDay,
                  },
                },
              },
            },
            {
              notificationId: {
                not: null,
              },
            },
            {
              pushEnabled: true,
            },
            {
              // TODO clean
              role: 'admin',
            },
          ],
        },
        select: {
          id: true,
          lang: true,
          notificationId: true,
        },
      });
      for (let i = 0; usersForNotification.data[i]; i++) {
        const user = usersForNotification.data[i];
        if (!user || !user.notificationId) {
          continue;
        }

        const dateMonth = new Date();
        dateMonth.setDate(dateMonth.getDate() - 30);

        const notifications = await orm.pushNotificationFindMany({
          where: {
            AND: [
              {
                lang: user.lang,
              },
              {
                OR: [
                  {
                    PushNotificationUser: {
                      every: {
                        userId: {
                          not: user.id,
                        },
                      },
                    },
                  },
                  {
                    PushNotificationUser: {
                      some: {
                        AND: [
                          {
                            userId: user.id,
                          },
                          {
                            created: {
                              lt: dateMonth,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            ],
          },
          include: {
            PushNotificationUser: true,
          },
        });

        const _notification = notifications.data.sort((a, b) => {
          if (a.PushNotificationUser.length < b.PushNotificationUser.length) {
            return -1;
          }
          return 1;
        });
        if (_notification[0]) {
          const notification = _notification[0];
          if (!this.ws.getPushConnId(user.notificationId)) {
            continue;
          }
          this.ws.sendMessage(
            user.notificationId,
            {
              type: notification.title as 'info',
              message: notification.description,
              data: notification.path,
            },
            true
          );
          await orm.pushNotificationUserCreate({
            data: {
              userId: user.id,
              pushNotificationId: notification.id,
            },
          });
        }
      }
    }, CHECK_PUSH_NOTIFICATION_INTERVAL);
  }

  private checkTranslateService() {
    setInterval(async () => {
      const timeout = setTimeout(async () => {
        const d = await orm.serverMessageFindMany({
          where: {
            comment: TRANSLATE_SERVICE_UNAVAILABLE_COMMENT,
          },
        });

        if (d.status !== 'info') {
          const commmandPath = path.resolve(
            this.cwd,
            `../../scripts/${SCRIPT_FILE_SERVER_MESSAGES}`
          );
          const command: ScriptServerMessagesArgName = 'unavailable-create';
          await this.run('node', [commmandPath, command]);

          sendEmail({
            email: ADMIN_EMAIL,
            subject: 'Translate server is not responding',
            locale: 'en',
            type: 'admin-message',
            data: {
              message: `Server is not responding from checkTranslateService ${JSON.stringify({
                NODE_ENV,
              })}`,
            },
          });
        }
      }, CHECK_TRANSLATE_SERVICE_TIMEOUT);
      let error = false;
      await new Promise((resolve) => {
        fetch(`${TRANSLATE_URL}/check`)
          .then((r) => r.text())
          .then((d) => {
            resolve(d);
          })
          .catch((e) => {
            log('error', 'Error check translate service', e);
            error = true;
          });
      });
      clearTimeout(timeout);

      const d = await orm.serverMessageFindMany({
        where: {
          comment: TRANSLATE_SERVICE_UNAVAILABLE_COMMENT,
        },
      });
      if (d.status === 'info' && !error) {
        sendEmail({
          email: ADMIN_EMAIL,
          subject: 'Translate server is awailable now!',
          locale: 'en',
          type: 'admin-message',
          data: {
            message: `Server is responding again from checkTranslateService ${JSON.stringify({
              NODE_ENV,
            })}`,
          },
        });
        await orm.serverMessageDeleteMany({
          where: {
            id: {
              in: d.data.map((item) => item.id),
            },
          },
        });
      }
    }, CHECK_TRANSLATE_SERVICE_TIMEOUT * 2);
  }

  private run(command: string, args: string[]) {
    return new Promise((resolve) => {
      const bat = spawn(command, args);

      bat.stdout.on('data', (data) => {
        log('info', data.toString());
      });

      bat.stderr.on('data', (data) => {
        log('error', data.toString());
      });

      bat.on('exit', (code) => {
        log(code === 0 ? 'info' : 'error', `Child exited with code ${code}`);
        resolve(code);
      });
    });
  }
}

export default Tasks;
