/* eslint-disable no-unused-vars */
import { Prisma, User, Page, Phrase, Tag, Online } from '@prisma/client';
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

  public abstract onlineCreate<T extends Prisma.OnlineCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.OnlineCreateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Online | null>, Promise<Result<Prisma.OnlineGetPayload<T> | null>>>
  >;

  public abstract onlineDelete<T extends Prisma.OnlineDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.OnlineDeleteArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Online | null>, Promise<Result<Prisma.OnlineGetPayload<T> | null>>>
  >;

  public abstract onlineFindFirst<T extends Prisma.OnlineFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.OnlineFindFirstArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Online | null>, Promise<Result<Prisma.OnlineGetPayload<T> | null>>>
  >;

  public abstract onlineFindMany<T extends Prisma.OnlineFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.OnlineFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Array<Online>>, Promise<Result<Array<Prisma.OnlineGetPayload<T>>>>>
  >;

  public abstract userUpdate<T extends Prisma.UserUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<User | null>, Promise<Result<Prisma.UserGetPayload<T> | null>>>
  >;

  public abstract pageFindMany<T extends Prisma.PageFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PageFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Array<Page>>, Promise<Result<Array<Prisma.PageGetPayload<T>>>>>
  >;

  public abstract phraseFindMany<T extends Prisma.PhraseFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Array<Phrase>>, Promise<Result<Array<Prisma.PhraseGetPayload<T>>>>>
  >;

  public abstract phraseFindFirst<T extends Prisma.PhraseFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseFindFirstArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Phrase | null>, Promise<Result<Prisma.PhraseGetPayload<T> | null>>>
  >;

  public abstract phraseCreate<T extends Prisma.PhraseCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseCreateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Phrase | null>, Promise<Result<Prisma.PhraseGetPayload<T> | null>>>
  >;

  public abstract phraseUpdate<T extends Prisma.PhraseUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseUpdateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Phrase | null>, Promise<Result<Prisma.PhraseGetPayload<T> | null>>>
  >;

  public abstract phraseDelete<T extends Prisma.PhraseDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseDeleteArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Phrase | null>, Promise<Result<Prisma.PhraseGetPayload<T> | null>>>
  >;

  public abstract tagFindMany<T extends Prisma.TagFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.TagFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Array<Tag>>, Promise<Result<Array<Prisma.TagGetPayload<T>>>>>
  >;

  public abstract tagCreate<T extends Prisma.TagCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TagCreateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Tag | null>, Promise<Result<Prisma.TagGetPayload<T> | null>>>
  >;

  public abstract tagFindFirst<T extends Prisma.TagFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.TagFindFirstArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Tag | null>, Promise<Result<Prisma.TagGetPayload<T> | null>>>
  >;

  public abstract tagUpdate<T extends Prisma.TagUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TagUpdateArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Tag | null>, Promise<Result<Prisma.TagGetPayload<T> | null>>>
  >;

  public abstract tagDelete<T extends Prisma.TagDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.TagDeleteArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Tag | null>, Promise<Result<Prisma.TagGetPayload<T> | null>>>
  >;
}

export default Database;
