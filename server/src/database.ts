/* eslint-disable no-unused-vars */
import { Prisma, User, PrismaPromise, Page } from '@prisma/client';
import { DatabaseContext } from './types';
import { Result } from './types/interfaces';

abstract class Database {
  public abstract userFindFirst<T extends Prisma.UserFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>,
    context: DatabaseContext
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<User | null>,
      PrismaPromise<Result<Prisma.UserGetPayload<T> | null>>
    >
  >;

  public abstract userCreate<T extends Prisma.UserCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserCreateArgs>,
    context: DatabaseContext
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<User | null>,
      PrismaPromise<Result<Prisma.UserGetPayload<T> | null>>
    >
  >;

  public abstract pageFindManyW<T extends Prisma.PageFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PageFindManyArgs>,
    context: DatabaseContext
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<Page>>,
      PrismaPromise<Result<Array<Prisma.PageGetPayload<T>>>>
    >
  >;
}

export default Database;
