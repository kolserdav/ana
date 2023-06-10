import { spawn } from 'child_process';
import { TRANSLATE_SERVICE_UNAVAILABLE_COMMENT } from '../types/interfaces';
import {
  ADMIN_EMAIL,
  CHECK_TRANSLATE_SERVICE_TIMEOUT,
  SCRIPT_FILE_SERVER_MESSAGES,
  TRANSLATE_URL,
  NODE_ENV,
} from '../utils/constants';
import { sendEmail } from '../utils/email';
import { ORM } from './orm';
import { log } from 'console';
import path from 'path';
import { ScriptServerMessagesArgName } from '../types';

const orm = new ORM();

class Tasks {
  cwd = process.cwd();

  constructor() {
    if (NODE_ENV !== 'development') {
      this.checkTranslateService();
    }
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
