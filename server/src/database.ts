/* eslint-disable no-unused-vars */
import { Prisma as P, User, PrismaPromise } from '@prisma/client';

abstract class Database {
  public abstract userFindFirst<T extends P.UserFindFirstArgs>(
    args: P.SelectSubset<T, P.UserFindFirstArgs>,
    context: any
  ): Promise<
    P.CheckSelect<T, User | null | undefined, PrismaPromise<P.UserGetPayload<T> | null | undefined>>
  >;
}

export default Database;
