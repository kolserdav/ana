import { PrismaClient, Prisma as P, PrismaPromise } from '@prisma/client';
import cluster, { Worker } from 'cluster';
import { v4 } from 'uuid';
import Service from './service';
import Database from '../database';
import { ArgsProcessSubset, ProcessMessage, SendProcessMessageArgs } from '../types';
import { log } from '../utils/lib';

const prisma = new PrismaClient();

export class ORM extends Service implements Database {
  private readonly protocol = 'orm';

  private readonly dbError = 'Database error';

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
  }

  public createServer() {
    this.listenMasterMessages<ProcessMessage.DB_COMMAND>(async ({ protocol, msg }) => {
      if (protocol === 'orm' && msg.type === ProcessMessage.DB_COMMAND) {
        const { data } = msg;
        const result = await this.run({ ...data });
        const _msg: SendProcessMessageArgs<ProcessMessage.DB_RESULT> = { ...msg };
        _msg.data = result;
        _msg.type = ProcessMessage.DB_RESULT;
        this.sendMessageToMaster<ProcessMessage.DB_RESULT>({
          protocol,
          msg: _msg,
        });
      } else {
        log('warn', 'Unexpected protocol or type', { protocol, type: msg.type });
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async run({
    model,
    command,
    args,
  }: ArgsProcessSubset<ProcessMessage.DB_COMMAND>): Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    P.CheckSelect<any, any, PrismaPromise<any>>
  > {
    const { skip, take, where } = args;
    let result;
    let count: number | undefined;
    try {
      if (command === 'findMany') {
        count = await (prisma as any)[model].count({ where });
      }
      result = await (prisma as any)[model][command](args);
    } catch (err: any) {
      log('error', 'Database error', err);
      return {
        status: 'error',
        message: '',
        data: /[a-zA-Z]+Many$/.test(command) ? [] : null,
        skip,
        stdErrMessage: err.message,
        take,
        count,
      };
    }
    return {
      status: result === null || result?.length === 0 ? 'warning' : 'success',
      message: '',
      data: result,
      skip,
      take,
      count,
    };
  }

  public userFindFirst: Database['userFindFirst'] = async (args, context) => {
    const id = v4();
    return new Promise((resolve) => {
      const { worker, handler } = this.listenWorkerMessages<ProcessMessage.DB_RESULT>(
        ({ msg: { id: _id, data } }) => {
          if (id === _id) {
            if (data === undefined) {
              log('error', this.dbError, { args, context });
            }
            worker.removeListener('message', handler);
            resolve(data);
          }
        }
      );
      this.sendMessageToWorker<ProcessMessage.DB_COMMAND>({
        protocol: this.protocol,
        msg: {
          type: ProcessMessage.DB_COMMAND,
          id,
          data: {
            model: 'user',
            command: 'findFirst',
            args,
          },
        },
      });
    });
  };
}
