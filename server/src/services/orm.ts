import { PrismaClient, Prisma as P, PrismaPromise, Prisma } from '@prisma/client';
import cluster, { Worker } from 'cluster';
import { v4 } from 'uuid';
import Service from './service';
import Database from '../database';
import {
  ArgsProcessSubset,
  DatabaseContext,
  ProcessMessage,
  SendProcessMessageArgs,
} from '../types';
import { getLang, getLocale, log } from '../utils/lib';
import { Result } from '../types/interfaces';

const prisma = new PrismaClient();

export class ORM extends Service implements Database {
  private readonly protocol = 'orm';

  private readonly errorStatus = 'error';

  constructor(worker?: Worker) {
    let _worker = worker;
    if (!_worker && cluster.isPrimary) {
      const { workers } = cluster;
      if (workers) {
        // eslint-disable-next-line prefer-destructuring
        _worker = (workers as Record<number, Worker>)[1];
      } else {
        log('warn', 'Workers not found', { err: new Error() });
      }
    }
    super(_worker);
    if (worker && cluster.isPrimary) {
      this.createServer();
    }
  }

  public createServer() {
    this.listenWorkerMessages<ProcessMessage.DB_COMMAND>(async ({ protocol, msg, context }) => {
      if (protocol === 'orm' && msg.type === ProcessMessage.DB_COMMAND) {
        const { data } = msg;
        const result = await this.run({ ...data }, context);
        const _msg: SendProcessMessageArgs<ProcessMessage.DB_RESULT> = { ...msg };
        _msg.data = result;
        _msg.type = ProcessMessage.DB_RESULT;
        this.sendMessageToWorker<ProcessMessage.DB_RESULT>({
          protocol,
          msg: _msg,
          context,
        });
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async run(
    { model, command, args }: ArgsProcessSubset<ProcessMessage.DB_COMMAND>,
    { headers }: DatabaseContext
  ): Promise<any> {
    const { skip, take, where } = args;
    let result;
    let count: number | undefined;
    const lang = getLang(headers);
    const locale = getLocale(lang).server;
    try {
      if (command === 'findMany') {
        count = await (prisma as any)[model].count({ where });
      }
      result = await (prisma as any)[model][command](args);
    } catch (err: any) {
      log('error', 'Database error', err);
      return {
        status: 'error',
        message: locale.error,
        data: /[a-zA-Z]+Many$/.test(command) ? [] : null,
        skip,
        stdErrMessage: err.message,
        take,
        count,
      };
    }
    return {
      status: result === null || result?.length === 0 ? 'warning' : 'success',
      message: result === null || result?.length === 0 ? locale.notFound : locale.success,
      data: result,
      skip,
      take,
      count,
    };
  }

  public runFromWorker = async ({
    args,
    context,
    model,
    command,
  }: {
    args: any;
    context: DatabaseContext;
    model: keyof PrismaClient;
    command: Prisma.PrismaAction;
  }) => {
    const id = v4();
    return new Promise<any>((resolve) => {
      const { master, handler } = this.listenMasterMessages<ProcessMessage.DB_RESULT>(
        ({ msg: { id: _id, data } }) => {
          if (id === _id) {
            if (data.status === this.errorStatus) {
              log('warn', 'Database request failed', { args, context });
            }
            master.removeListener('message', handler);
            resolve(data);
          }
        }
      );
      this.sendMessageToMaster<ProcessMessage.DB_COMMAND>({
        protocol: this.protocol,
        msg: {
          type: ProcessMessage.DB_COMMAND,
          id,
          data: {
            model,
            command,
            args,
          },
        },
        context,
      });
    });
  };

  public userFindFirst: Database['userFindFirst'] = async (args, context) => {
    return this.runFromWorker({
      args,
      context,
      model: 'user',
      command: 'findFirst',
    });
  };

  public userFindFirstM: Database['userFindFirst'] = async (args, context) => {
    return this.run(
      {
        args,
        model: 'user',
        command: 'findFirst',
      },
      context
    );
  };
}
