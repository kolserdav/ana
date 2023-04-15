import { PrismaClient } from '@prisma/client';
import cluster, { Worker } from 'cluster';
import { v4 } from 'uuid';
import Service from './service';
import Database from '../database';
import { checkIsFind, checkIsMany, log } from '../utils/lib';
import { DBCommandProps, Result } from '../types/interfaces';

const prisma = new PrismaClient();

export class ORM extends Service implements Database {
  private readonly protocol = 'orm';

  private readonly errorStatus = 'error';

  constructor(worker?: Worker) {
    super(worker);
    if (worker && cluster.isPrimary) {
      this.createServer();
    }
  }

  public userFindFirst: Database['userFindFirst'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'user',
      command: 'findFirst',
    });
  };

  public userCreate: Database['userCreate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'user',
      command: 'create',
    });
  };

  public userUpdate: Database['userUpdate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'user',
      command: 'update',
    });
  };

  public pageFindMany: Database['pageFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'page',
      command: 'findMany',
    });
  };

  private createServer() {
    this.listenWorkerMessages<DBCommandProps>(async ({ id, msg }) => {
      const result = await this.run({ ...msg });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.sendMessageToWorker<Result<any>>({
        id,
        msg: result,
      });
    });
  }

  private async run({
    model,
    command,
    args,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DBCommandProps): Promise<any> {
    const { skip, take, where } = args;
    let count: number | undefined;

    let result;
    // Run command
    try {
      if (command === 'findMany') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        count = await (prisma as any)[model].count({ where });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = await (prisma as any)[model][command](args);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      log('error', 'Database error', err);
      return {
        status: 'error',
        data: checkIsMany(command),
        skip,
        code: 500,
        stdErrMessage: err.message,
        _command: command,
        _model: model,
        take,
        count,
      };
    }

    const isNotFound = result === null || result?.length === 0;
    return {
      status: isNotFound ? 'warn' : 'info',
      data: result,
      code: isNotFound ? 404 : checkIsFind(command) ? 200 : 201,
      _command: command,
      _model: model,
      skip,
      take,
      count,
    };
  }

  private runFromWorker = async ({ args, model, command }: DBCommandProps) => {
    const id = v4();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise<any>((resolve) => {
      const { master, handler } = this.listenMasterMessages<Result<any>>(({ id: _id, msg }) => {
        if (id === _id) {
          if (msg.status === this.errorStatus) {
            log('error', 'Database request failed', { args });
          }
          master.removeListener('message', handler);
          resolve(msg);
        }
      });
      this.sendMessageToMaster<DBCommandProps>({
        id,
        msg: {
          model,
          command,
          args,
        },
      });
    });
  };
}
