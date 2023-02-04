import { PrismaClient, Prisma } from '@prisma/client';
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
import { checkIsFind, checkIsMany, parseHeaders, getLocale, log } from '../utils/lib';
import { REDIS_CACHE_TIMEOUT, REDIS_RESERVED } from '../utils/constants';
import Redis from '../protocols/redis';
import { Result } from '../types/interfaces';

const prisma = new PrismaClient();
const redis = new Redis();

export class ORM extends Service implements Database {
  private readonly protocol = 'orm';

  private readonly errorStatus = 'error';

  constructor(worker?: Worker) {
    super(worker);
    if (worker && cluster.isPrimary) {
      this.createServer();
    }
  }

  public userFindFirstW: Database['userFindFirst'] = async (args, context) => {
    return this.runFromWorker({
      args,
      context,
      model: 'user',
      command: 'findFirst',
    });
  };

  public userCreate: Database['userCreate'] = async (args, context) => {
    return this.run(
      {
        args,
        model: 'user',
        command: 'create',
      },
      context
    );
  };

  public userUpdate: Database['userUpdate'] = async (args, context) => {
    return this.run(
      {
        args,
        model: 'user',
        command: 'update',
      },
      context
    );
  };

  public userFindFirst: Database['userFindFirst'] = async (args, context) => {
    return this.run(
      {
        args,
        model: 'user',
        command: 'findFirst',
      },
      context
    );
  };

  public pageFindManyW: Database['pageFindManyW'] = async (args, context) => {
    return this.runFromWorker({
      args,
      context,
      model: 'page',
      command: 'findMany',
    });
  };

  private createServer() {
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
    const { lang } = parseHeaders(headers);
    const locale = getLocale(lang).server;

    const { skip, take, where } = args;
    let count: number | undefined;

    // Check args
    const argsStr = JSON.stringify(args);
    if (REDIS_RESERVED.indexOf(argsStr) !== -1) {
      const stdErrMessage = 'Trying to write to a Redis reserved field in a database';
      log('warn', stdErrMessage, { argsStr });
      return {
        status: 'error',
        message: locale.badRequest,
        data: checkIsMany(command),
        skip,
        code: 400,
        stdErrMessage,
        take,
        count,
      } as Result<any>;
    }

    // Get from cache
    const oldValue = await redis.client.get(argsStr);
    let result;
    if (oldValue) {
      try {
        result = JSON.parse(oldValue);
      } catch (err) {
        log('error', 'Error parsing Redis value in Database', err);
      }
      if (result !== undefined) {
        const isNotFound = result === null || result?.length === 0;
        return {
          status: isNotFound ? 'warning' : 'info',
          message: isNotFound ? locale.notFound : locale.success,
          data: result,
          code: isNotFound ? 404 : checkIsFind(command) ? 200 : 201,
          skip,
          take,
          count,
        } as Result<any>;
      }
    }

    // Run command
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
        data: checkIsMany(command),
        skip,
        code: 500,
        stdErrMessage: err.message,
        take,
        count,
      } as Result<any>;
    }

    redis.client.set(argsStr, JSON.stringify(result), { EX: REDIS_CACHE_TIMEOUT });
    const isNotFound = result === null || result?.length === 0;
    return {
      status: isNotFound ? 'warning' : 'info',
      message: isNotFound ? locale.notFound : locale.success,
      data: result,
      code: isNotFound ? 404 : checkIsFind(command) ? 200 : 201,
      skip,
      take,
      count,
    } as Result<any>;
  }

  private runFromWorker = async ({
    args,
    context,
    model,
    command,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
}
