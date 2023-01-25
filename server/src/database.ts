/* eslint-disable no-unused-vars */
import { Prisma as P, User, PrismaPromise } from '@prisma/client';
import { DatabaseContext } from './types';
import { Result } from './types/interfaces';

abstract class Database {
  public abstract userFindFirst<T extends P.UserFindFirstArgs>(
    args: P.SelectSubset<T, P.UserFindFirstArgs>,
    context: DatabaseContext
  ): Promise<
    P.CheckSelect<T, Result<User | null>, PrismaPromise<Result<P.UserGetPayload<T> | null>>>
  >;
}

export default Database;
