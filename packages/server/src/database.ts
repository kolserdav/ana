/* eslint-disable no-unused-vars */
import { Prisma, User, Page, File } from '@prisma/client';
import { Result } from './types/interfaces';

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

  public abstract fileCreateW<T extends Prisma.FileCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FileCreateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<File | null>, Promise<Result<Prisma.FileGetPayload<T> | null>>>
  >;

  public abstract fileUpdateW<T extends Prisma.FileUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FileUpdateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<File | null>, Promise<Result<Prisma.FileGetPayload<T> | null>>>
  >;
}

export default Database;
