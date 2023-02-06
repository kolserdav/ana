import { PrismaClient } from '@prisma/client';
import cluster, { Worker } from 'cluster';
import { v4 } from 'uuid';
import Service from './service';
import Database from '../database';
import { checkIsFind, checkIsMany, log } from '../utils/lib';
import { REDIS_CACHE_TIMEOUT, REDIS_RESERVED } from '../utils/constants';
import Redis from '../protocols/redis';
import { MessageType, DBResult, SendMessageArgs, DBCommandProps } from '../types/interfaces';
import { ProcessMessage } from '../types';

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

  public userFindFirstW: Database['userFindFirst'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'user',
      command: 'findFirst',
    });
  };

  public userCreate: Database['userCreate'] = async (args) => {
    return this.run({
      args,
      model: 'user',
      command: 'create',
    });
  };

  public userUpdate: Database['userUpdate'] = async (args) => {
    return this.run({
      args,
      model: 'user',
      command: 'update',
    });
  };

  public userFindFirst: Database['userFindFirst'] = async (args) => {
    return this.run({
      args,
      model: 'user',
      command: 'findFirst',
    });
  };

  public pageFindManyW: Database['pageFindManyW'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'page',
      command: 'findMany',
    });
  };

  private createServer() {
    this.listenWorkerMessages<MessageType.DB_COMMAND>(async ({ protocol, msg }) => {
      if (protocol === 'orm' && msg.type === MessageType.DB_COMMAND) {
        const { data } = msg;
        const result = await this.run({ ...data });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const _msg: ProcessMessage<MessageType.DB_RESULT>['msg'] = { ...msg } as any;
        _msg.data = result;
        _msg.type = MessageType.DB_RESULT;
        this.sendMessageToWorker<MessageType.DB_RESULT>({
          protocol,
          msg: _msg,
        });
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async run({
    model,
    command,
    args,
  }: SendMessageArgs<MessageType.DB_COMMAND>['data']): Promise<any> {
    const { skip, take, where } = args;
    let count: number | undefined;

    // Check args
    const argsStr = JSON.stringify(args);
    if (REDIS_RESERVED.indexOf(argsStr) !== -1) {
      const stdErrMessage = 'Trying to write to a Redis reserved field in a database';
      log('warn', stdErrMessage, { argsStr });
      return {
        status: 'error',
        data: checkIsMany(command),
        skip,
        code: 400,
        stdErrMessage,
        take,
        count,
      } as DBResult<any>;
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
          data: result,
          code: isNotFound ? 404 : checkIsFind(command) ? 200 : 201,
          skip,
          take,
          count,
        } as DBResult<any>;
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
        data: checkIsMany(command),
        skip,
        code: 500,
        stdErrMessage: err.message,
        take,
        count,
      } as DBResult<any>;
    }

    redis.client.set(argsStr, JSON.stringify(result), { EX: REDIS_CACHE_TIMEOUT });
    const isNotFound = result === null || result?.length === 0;
    return {
      status: isNotFound ? 'warning' : 'info',
      data: result,
      code: isNotFound ? 404 : checkIsFind(command) ? 200 : 201,
      skip,
      take,
      count,
    } as DBResult<any>;
  }

  private runFromWorker = async ({ args, model, command }: DBCommandProps) => {
    const id = v4();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise<any>((resolve) => {
      const { master, handler } = this.listenMasterMessages<MessageType.DB_RESULT>(
        ({ msg: { id: _id, data } }) => {
          if (id === _id) {
            if (data.status === this.errorStatus) {
              log('warn', 'Database request failed', { args });
            }
            master.removeListener('message', handler);
            resolve(data);
          }
        }
      );
      this.sendMessageToMaster<MessageType.DB_COMMAND>({
        protocol: this.protocol,
        msg: {
          type: MessageType.DB_COMMAND,
          id,
          data: {
            model,
            command,
            args,
          },
        },
      });
    });
  };
}
