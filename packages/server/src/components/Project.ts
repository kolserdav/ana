import { Prisma } from '@prisma/client';
import { existsSync } from 'fs';
import path from 'path';
import AMQP from '../protocols/amqp';
import WS from '../protocols/ws';
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
            OR: [{ employerId: id }, { workerId: id }, { employerId: null }, { workerId: null }],
          },
        ],
      },
      include: {
        File: {
          where: {
            ProjectMessage: {
              every: {
                fileId: null,
              },
            },
          },
        },
        ProjectEvent: true,
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
      orderBy: {
        updated: 'desc',
      },
      include: {
        File: {
          select: {
            id: true,
          },
        },
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

  public async giveProject(
    { id, connId, lang, timeout, data }: SendMessageArgs<MessageType.GET_GIVE_PROJECT>,
    amqp: AMQP
  ) {
    if (!connId) {
      log('warn', 'Conn id not provided in projectGiveProject', { connId });
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
          type: MessageType.GET_GIVE_PROJECT,
          message: locale.error,
          httpCode: user.code,
        },
      });
      return;
    }

    const project = await orm.projectFindFirst({
      where: {
        id: data.id,
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
          status: 'error',
          type: MessageType.GET_GIVE_PROJECT,
          message: locale.error,
          httpCode: project.code,
        },
      });
      return;
    }

    if (project.data.employerId !== null && project.data.workerId !== null) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'warn',
          type: MessageType.GET_GIVE_PROJECT,
          message: locale.forbidden,
          httpCode: 403,
        },
      });
      return;
    }

    if (project.data.employerId === null && user.data.role !== 'employer') {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'warn',
          type: MessageType.GET_GIVE_PROJECT,
          message: locale.unauthorized,
          httpCode: 401,
        },
      });
      return;
    }

    if (project.data.workerId === null && user.data.role !== 'worker') {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'warn',
          type: MessageType.GET_GIVE_PROJECT,
          message: locale.unauthorized,
          httpCode: 401,
        },
      });
      return;
    }

    const prUp = await orm.projectUpdate({
      where: {
        id: data.id,
      },
      data: {
        employerId: project.data.employerId === null ? id : project.data.employerId,
        workerId: project.data.workerId === null ? id : project.data.workerId,
        updated: new Date(),
        ProjectEvent: {
          create: {
            sideId: id,
            event: 'acceptSide',
          },
        },
      },
      include: {
        File: true,
        ProjectEvent: true,
      },
    });

    if (prUp.status !== 'info' || !prUp.data) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'error',
          type: MessageType.GET_GIVE_PROJECT,
          message: locale.error,
          httpCode: prUp.code,
        },
      });
      return;
    }

    amqp.sendToQueue({
      type: MessageType.SET_GIVE_PROJECT,
      id,
      lang,
      timeout,
      connId,
      data: prUp.data,
    });
  }

  public async postMessage(
    {
      id,
      connId,
      lang,
      timeout,
      data: { content, projectId, fileId },
    }: SendMessageArgs<MessageType.GET_POST_PROJECT_MESSAGE>,
    amqp: AMQP
  ) {
    if (!connId) {
      log('warn', 'Conn id not provided in projectPostMessage', { connId });
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
          type: MessageType.GET_POST_PROJECT_MESSAGE,
          message: locale.error,
          httpCode: user.code,
        },
      });
      return;
    }

    const project = await orm.projectFindFirst({
      where: {
        id: projectId,
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
          status: 'error',
          type: MessageType.GET_POST_PROJECT_MESSAGE,
          message: locale.error,
          httpCode: project.code,
        },
      });
      return;
    }

    if (user.data.id !== project.data.workerId && user.data.id !== project.data.employerId) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'warn',
          type: MessageType.GET_POST_PROJECT_MESSAGE,
          message: locale.unauthorized,
          httpCode: 401,
        },
      });
      return;
    }

    if (fileId) {
      const file = await orm.fileUpdate({
        where: {
          id: fileId,
        },
        data: {
          projectId,
        },
      });
      if (file.status !== 'info') {
        amqp.sendToQueue({
          type: MessageType.SET_ERROR,
          id,
          lang,
          timeout,
          connId,
          data: {
            status: 'error',
            type: MessageType.GET_POST_PROJECT_MESSAGE,
            message: locale.error,
            httpCode: file.code,
          },
        });
        return;
      }
    }

    const projectMess = await orm.projectMessageCreate({
      data: {
        projectId,
        content,
        userId: id,
        fileId: fileId || null,
      },
      include: {
        File: true,
      },
    });

    if (projectMess.status !== 'info' || !projectMess.data) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'error',
          type: MessageType.GET_POST_PROJECT_MESSAGE,
          message: locale.error,
          httpCode: projectMess.code,
        },
      });
      return;
    }

    amqp.sendToQueue({
      type: MessageType.SET_POST_PROJECT_MESSAGE,
      id,
      lang,
      timeout,
      connId,
      data: projectMess.data,
    });
  }

  public async messageFindMany(
    {
      id,
      connId,
      lang,
      timeout,
      data: { projectId },
    }: SendMessageArgs<MessageType.GET_PROJECT_MESSAGE_FIND_MANY>,
    amqp: AMQP
  ) {
    if (!connId) {
      log('warn', 'Conn id not provided in projectMessageFindMany', { connId });
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
          type: MessageType.GET_PROJECT_MESSAGE_FIND_MANY,
          message: locale.error,
          httpCode: user.code,
        },
      });
      return;
    }

    const project = await orm.projectFindFirst({
      where: {
        id: projectId,
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
          status: 'error',
          type: MessageType.GET_PROJECT_MESSAGE_FIND_MANY,
          message: locale.error,
          httpCode: project.code,
        },
      });
      return;
    }

    if (project.data.employerId !== user.data.id && project.data.workerId !== user.data.id) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'warn',
          type: MessageType.GET_PROJECT_MESSAGE_FIND_MANY,
          message: locale.unauthorized,
          httpCode: 401,
        },
      });
      return;
    }

    const projectMess = await orm.projectMessageFindMany({
      where: {
        projectId,
      },
      include: {
        File: true,
      },
    });
    if (projectMess.status === 'error') {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'error',
          type: MessageType.GET_PROJECT_MESSAGE_FIND_MANY,
          message: locale.error,
          httpCode: projectMess.code,
        },
      });
      return;
    }

    amqp.sendToQueue({
      type: MessageType.SET_PROJECT_MESSAGE_FIND_MANY,
      id,
      lang,
      timeout,
      connId,
      data: {
        skip: projectMess.skip,
        take: projectMess.take,
        count: projectMess.count,
        items: projectMess.data,
      },
    });
  }

  public async sendWSNotification(
    { data, id, timeout, type, lang }: SendMessageArgs<MessageType.SET_POST_PROJECT_MESSAGE>,
    ws: WS
  ) {
    const { projectId } = data;
    const project = await orm.projectFindFirst({
      where: {
        id: projectId,
      },
    });
    if (project.status !== 'info' || !project.data) {
      return;
    }

    const target = id === project.data.employerId ? project.data.workerId : project.data.employerId;
    if (!target) {
      return;
    }

    if (ws.checkWS(target)) {
      ws.sendMessage({
        type,
        timeout,
        lang,
        data,
        id: target,
      });
    }
  }
}

export default Project;
