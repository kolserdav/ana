import { Prisma, PrismaClient } from '@prisma/client';
import cluster, { Worker } from 'cluster';
import { v4 } from 'uuid';
import Service from './service';
import Database from '../database';
import { checkIsFind, checkIsMany, log } from '../utils/lib';
import { Result } from '../types/interfaces';
import { PRISMA_LOG } from '../utils/constants';
import { DBCommandProps } from '../types';

const prisma = new PrismaClient({ log: [PRISMA_LOG] });

export class ORM extends Service implements Database {
  private readonly errorStatus = 'error';

  constructor(worker?: Worker) {
    super(worker);
    if (worker && cluster.isPrimary) {
      this.createServer();
    }
  }

  public selectorFindMany: Database['selectorFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'selector',
      command: 'findMany',
    });
  };

  public selectorDeleteMany: Database['selectorDeleteMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'selector',
      command: 'deleteMany',
    });
  };

  public selectorCreate: Database['selectorCreate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'selector',
      command: 'create',
    });
  };

  public $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Promise<Result<T>> {
    return this.runFromWorker({
      args: query as any,
      model: values as any,
      values,
      command: '$queryRawUnsafe',
    });
  }

  public phraseFindMany: Database['phraseFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'phrase',
      command: 'findMany',
    });
  };

  public phraseCreate: Database['phraseCreate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'phrase',
      command: 'create',
    });
  };

  public phraseFindFirst: Database['phraseFindFirst'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'phrase',
      command: 'findFirst',
    });
  };

  public phraseUpdate: Database['phraseUpdate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'phrase',
      command: 'update',
    });
  };

  public phraseDelete: Database['phraseDelete'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'phrase',
      command: 'delete',
    });
  };

  public phraseDeleteMany: Database['phraseDeleteMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'phrase',
      command: 'deleteMany',
    });
  };

  public phraseUpdateMany: Database['phraseUpdateMany'] = async (args) => {
    prisma.phrase.updateMany;
    return this.runFromWorker({
      args,
      model: 'phrase',
      command: 'updateMany',
    });
  };

  public phraseTagDeleteMany: Database['phraseTagDeleteMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'phraseTag',
      command: 'deleteMany',
    });
  };

  public tagFindMany: Database['tagFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'tag',
      command: 'findMany',
    });
  };

  public tagCreate: Database['tagCreate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'tag',
      command: 'create',
    });
  };

  public restoreLinkCreate: Database['restoreLinkCreate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'restoreLink',
      command: 'create',
    });
  };

  public restoreLinkDelete: Database['restoreLinkDelete'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'restoreLink',
      command: 'delete',
    });
  };

  public tagFindFirst: Database['tagFindFirst'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'tag',
      command: 'findFirst',
    });
  };

  public tagUpdate: Database['tagUpdate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'tag',
      command: 'update',
    });
  };

  public tagDelete: Database['tagDelete'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'tag',
      command: 'delete',
    });
  };

  public userFindFirst: Database['userFindFirst'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'user',
      command: 'findFirst',
    });
  };

  public userFindMany: Database['userFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'user',
      command: 'findMany',
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

  public userDelete: Database['userDelete'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'user',
      command: 'delete',
    });
  };

  public onlineCreate: Database['onlineCreate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'online',
      command: 'create',
    });
  };

  public onlineDelete: Database['onlineDelete'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'online',
      command: 'delete',
    });
  };

  public onlineFindFirst: Database['onlineFindFirst'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'online',
      command: 'findFirst',
    });
  };

  public onlineFindMany: Database['onlineFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'online',
      command: 'findMany',
    });
  };

  public serverMessageFindMany: Database['serverMessageFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'serverMessage',
      command: 'findMany',
    });
  };

  public serverMessageDeleteMany: Database['serverMessageDeleteMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'serverMessage',
      command: 'deleteMany',
    });
  };

  public pageFindMany: Database['pageFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'page',
      command: 'findMany',
    });
  };

  /**
   *
   * @param model [`'phrase'`]
   * @param args [`PhraseCountArgs`]
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  count: Database['count'] = <T>(model: keyof PrismaClient, args: Prisma.SelectSubset<T, any>) => {
    return this.runFromWorker({
      args,
      model,
      command: 'count',
    });
  };

  phraseGroupBy: Database['phraseGroupBy'] = (args) => {
    return this.runFromWorker({
      args,
      model: 'phrase',
      command: 'groupBy',
    });
  };

  public onlineStatisticAggregate: Database['onlineStatisticAggregate'] = async (args) => {
    prisma.tag.findMany;
    return this.runFromWorker({
      args,
      model: 'onlineStatistic',
      command: 'aggregate',
    });
  };

  public onlineStatisticCreate: Database['onlineStatisticCreate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'onlineStatistic',
      command: 'create',
    });
  };

  public onlineStatisticFindFirst: Database['onlineStatisticFindFirst'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'onlineStatistic',
      command: 'findFirst',
    });
  };

  public onlineStatisticUpdate: Database['onlineStatisticUpdate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'onlineStatistic',
      command: 'update',
    });
  };

  public onlineStatisticDelete: Database['onlineStatisticDelete'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'onlineStatistic',
      command: 'delete',
    });
  };

  public onlineStatisticFindMany: Database['onlineStatisticFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'onlineStatistic',
      command: 'findMany',
    });
  };

  public pushNotificationFindMany: Database['pushNotificationFindMany'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'pushNotification',
      command: 'findMany',
    });
  };

  public pushNotificationUserCreate: Database['pushNotificationUserCreate'] = async (args) => {
    return this.runFromWorker({
      args,
      model: 'pushNotificationUser',
      command: 'create',
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

  // FIXME protect message
  private async run({
    model,
    command,
    args,
    values,
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
      if (command === '$queryRawUnsafe' && values) {
        result = await prisma.$queryRawUnsafe(args as any, ...values);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result = await (prisma as any)[model][command](args);
      }

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

  private runFromWorker = async (msg: DBCommandProps) => {
    const id = v4();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise<any>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { master, handler } = this.listenMasterMessages<Result<any>>(({ id: _id, msg }) => {
        if (id === _id) {
          if (msg.status === this.errorStatus) {
            log('error', 'Database request failed', { ...msg });
          }
          master.removeListener('message', handler);
          resolve(msg);
        }
      });
      this.sendMessageToMaster<DBCommandProps>({
        id,
        msg,
      });
    });
  };
}
