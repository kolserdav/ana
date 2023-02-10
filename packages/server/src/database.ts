/* eslint-disable no-unused-vars */
import { Prisma, User, Page } from '@prisma/client';
import { RequestContext, Result } from './types/interfaces';

abstract class Database {
  public abstract userFindFirst<T extends Prisma.UserFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<User | null>, Promise<Result<Prisma.UserGetPayload<T> | null>>>
  >;

  public abstract userCreate<T extends Prisma.UserCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserCreateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<User | null>, Promise<Result<Prisma.UserGetPayload<T> | null>>>
  >;

  public abstract userUpdate<T extends Prisma.UserUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<User | null>, Promise<Result<Prisma.UserGetPayload<T> | null>>>
  >;

  public abstract pageFindManyW<T extends Prisma.PageFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PageFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Array<Page>>, Promise<Result<Array<Prisma.PageGetPayload<T>>>>>
  >;
}

export default Database;
