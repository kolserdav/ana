import { Prisma } from '@prisma/client';
import { existsSync } from 'fs';
import path from 'path';
import AMQP from '../protocols/amqp';
import { ORM } from '../services/orm';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { CLOUD_PATH } from '../utils/constants';
import { getLocale, log } from '../utils/lib';

const orm = new ORM();

class Project {
  public async create(
    { lang, timeout, connId, id, data }: SendMessageArgs<MessageType.GET_PROJECT_CREATE>,
    amqp: AMQP
  ) {
    if (!connId) {
      log('warn', 'Conn id not provided in projectCreate', { connId });
      return;
    }
    const { title, description, endDate, files: _files, subcategories: _subcategories } = data;
    const locale = getLocale(lang).server;
    const end = new Date(endDate);
    if (
      !title ||
      !description ||
      !endDate ||
      typeof _files.map === 'undefined' ||
      typeof _subcategories.map === 'undefined' ||
      Number.isNaN(end)
    ) {
      log('warn', 'Create project with bad request', { data, id });
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'warn',
          type: MessageType.GET_PROJECT_CREATE,
          message: locale.badRequest,
          httpCode: 400,
        },
      });
      return;
    }

    const user = await orm.userFindFirst({
      where: { id },
    });
    if (user.status !== 'info' || !user.data) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: user.status,
          type: MessageType.GET_PROJECT_CREATE,
          message: locale.forbidden,
          httpCode: 403,
        },
      });
      return;
    }

    let filesRes;
    let files: string[] = [];
    if (_files.length !== 0) {
      const AND: Prisma.FileWhereInput['AND'] = _files.map((item) => ({ id: item }));
      AND.push({
        userId: id,
      });
      AND.push({
        projectId: null,
      });
      filesRes = await orm.fileFindMany({
        where: {
          AND,
        },
      });
      if (filesRes.status === 'error') {
        amqp.sendToQueue({
          type: MessageType.SET_ERROR,
          id,
          lang,
          timeout,
          connId,
          data: {
            status: 'error',
            type: MessageType.GET_PROJECT_CREATE,
            message: locale.error,
            httpCode: 500,
          },
        });
        return;
      }

      const errFiles: string[] = [];
      filesRes.data.forEach((item) => {
        const filePath = path.resolve(CLOUD_PATH, id, item.id, item.ext);
        if (!existsSync(filePath)) {
          errFiles.push(item.id);
        }
      });

      if (filesRes.data.length === _files.length && errFiles.length === 0) {
        files = _files;
      } else {
        const filesU = filesRes.data.map((item) => {
          if (errFiles.indexOf(item.id) === -1) {
            return item.id;
          }
          return undefined;
        });
        files = filesU.filter((item) => item !== undefined) as string[];
      }
    }

    const res = await orm.projectCreate({
      data: {
        title,
        description,
        ProjectSubcategory: {
          createMany: {
            data: _subcategories.map((item) => ({
              subcategoryId: item,
            })),
          },
        },
        workerId: user.data.role === 'worker' ? user.data.id : null,
        employerId: user.data.role === 'employer' ? user.data.id : null,
        end,
      },
    });
    if (res.status === 'error' || !res.data) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'error',
          type: MessageType.GET_PROJECT_CREATE,
          message: locale.error,
          httpCode: 500,
        },
      });
      return;
    }
    /* TODO
    const filesU = await orm.fileUpdateMany({
      where: {
        AND: files.map((item) => ({id: item}),
      },
      data: {
        projectId: res.data.id
      }
    });
*/
    amqp.sendToQueue({
      type: MessageType.SET_PROJECT_CREATE,
      id,
      lang,
      timeout,
      connId,
      data: res.data,
    });
  }
}

export default Project;
