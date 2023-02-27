/* eslint-disable no-unused-vars */
import { Prisma, User, Page, File, Category, Tag } from '@prisma/client';
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

  public abstract fileUpdate<T extends Prisma.FileUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FileUpdateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<File | null>, Promise<Result<Prisma.FileGetPayload<T> | null>>>
  >;

  public abstract fileDelete<T extends Prisma.FileDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.FileDeleteArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<File | null>, Promise<Result<Prisma.FileGetPayload<T> | null>>>
  >;

  public abstract fileFindMany<T extends Prisma.FileFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.FileFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Array<File>>, Promise<Result<Array<Prisma.FileGetPayload<T>>>>>
  >;

  public abstract categoryFindManyW<T extends Prisma.CategoryFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.CategoryFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<Category>>,
      Promise<Result<Array<Prisma.CategoryGetPayload<T>>>>
    >
  >;
}

export default Database;
