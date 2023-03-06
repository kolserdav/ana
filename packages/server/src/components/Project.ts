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
      const OR: Prisma.FileWhereInput['OR'] = _files.map((item) => ({ id: item }));
      OR.push({
        userId: id,
      });
      filesRes = await orm.fileFindMany({
        where: {
          AND: [{ OR }, { projectId: null }, { userId: user.data.id }],
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
        const filePath = path.resolve(CLOUD_PATH, id, `${item.id}${item.ext}`);
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

    if (files.length !== 0) {
      let error = false;
      for (let i = 0; files[i]; i++) {
        const item = files[i] as string;
        const filesU = await orm.fileUpdate({
          where: {
            id: item,
          },
          data: {
            projectId: res.data.id,
          },
        });
        if (filesU.status === 'error') {
          error = true;
        }
      }
      if (error || files.length !== _files.length) {
        amqp.sendToQueue({
          type: MessageType.SET_ERROR,
          id,
          lang,
          timeout,
          connId,
          data: {
            status: 'info',
            type: MessageType.GET_PROJECT_CREATE,
            message: `${locale.projectCreateButFilesNotSaved}: ${locale.sendToSupport}`,
            httpCode: 202,
          },
        });
        return;
      }
    }

    amqp.sendToQueue({
      type: MessageType.SET_PROJECT_CREATE,
      id,
      lang,
      timeout,
      connId,
      data: res.data,
    });
  }

  public async findFirst(
    { id, connId, lang, timeout, data }: SendMessageArgs<MessageType.GET_PROJECT_FIND_FIRST>,
    amqp: AMQP
  ) {
    if (!connId) {
      log('warn', 'Conn id not provided in projectFindFirst', { connId });
      return;
    }

    const locale = getLocale(lang).server;

    const user = await orm.userFindFirst({
      where: {
        id,
      },
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
          type: MessageType.GET_PROJECT_FIND_FIRST,
          message: locale.error,
          httpCode: user.code,
        },
      });
      return;
    }

    const project = await orm.projectFindFirst({
      where: {
        AND: [
          {
            id: data.id,
          },
          {
            OR: [{ employerId: id }, { workerId: id }],
          },
        ],
      },
    });

    if (project.status !== 'info' || !project.data) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: project.status,
          type: MessageType.GET_PROJECT_FIND_FIRST,
          message: project.status === 'error' ? locale.error : locale.notFound,
          httpCode: project.code,
        },
      });
      return;
    }

    amqp.sendToQueue({
      type: MessageType.SET_PROJECT_FIND_FIRST,
      id,
      lang,
      timeout,
      connId,
      data: project.data,
    });
  }

  public async findMany(
    { id, connId, lang, timeout }: SendMessageArgs<MessageType.GET_PROJECT_FIND_MANY>,
    amqp: AMQP
  ) {
    if (!connId) {
      log('warn', 'Conn id not provided in projectFindMany', { connId });
      return;
    }

    const locale = getLocale(lang).server;

    const user = await orm.userFindFirst({
      where: {
        id,
      },
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
          type: MessageType.GET_PROJECT_FIND_MANY,
          message: locale.error,
          httpCode: user.code,
        },
      });
      return;
    }

    const projects = await orm.projectFindMany({
      where:
        user.data.role === 'employer'
          ? {
              employerId: id,
            }
          : {
              workerId: id,
            },
    });

    if (projects.status === 'error') {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'error',
          type: MessageType.GET_PROJECT_FIND_MANY,
          message: locale.error,
          httpCode: 500,
        },
      });
      return;
    }

    amqp.sendToQueue({
      type: MessageType.SET_PROJECT_FIND_MANY,
      id,
      lang,
      timeout,
      connId,
      data: {
        skip: projects.skip,
        take: projects.take,
        count: projects.count,
        items: projects.data,
      },
    });
  }
}

export default Project;
