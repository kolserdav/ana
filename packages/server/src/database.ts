/* eslint-disable no-unused-vars */
import {
  Prisma,
  User,
  Page,
  Phrase,
  Tag,
  Online,
  ServerMessage,
  RestoreLink,
  OnlineStatistic,
  PrismaClient,
  Selector,
  PushNotification,
} from '@prisma/client';
import { Result } from './types/interfaces';

abstract class Database {
  public abstract count<T>(
    model: keyof PrismaClient,
    args: Prisma.SelectSubset<T, any>
  ): Promise<Result<number>>;

  public abstract phraseGroupBy<T extends Prisma.PhraseGroupByArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseGroupByArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Phrase | null>,
      Promise<Result<Prisma.GetPhraseGroupByPayload<T> | null>>
    >
  >;

  public abstract userFindFirst<T extends Prisma.UserFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<User | null>, Promise<Result<Prisma.UserGetPayload<T> | null>>>
  >;

  public abstract userFindMany<T extends Prisma.UserFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Array<User>>, Promise<Result<Array<Prisma.UserGetPayload<T>>>>>
  >;

  public abstract serverMessageFindMany<T extends Prisma.ServerMessageFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.ServerMessageFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<ServerMessage>>,
      Promise<Result<Array<Prisma.ServerMessageGetPayload<T>>>>
    >
  >;

  public abstract serverMessageDeleteMany<T extends Prisma.ServerMessageDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.ServerMessageDeleteManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<ServerMessage>>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Promise<Result<Array<Prisma.ServerMessageGetPayload<any>>>>
    >
  >;

  public abstract restoreLinkCreate<T extends Prisma.RestoreLinkCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.RestoreLinkCreateArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<RestoreLink | null>,
      Promise<Result<Prisma.RestoreLinkGetPayload<T> | null>>
    >
  >;

  public abstract restoreLinkDelete<T extends Prisma.RestoreLinkDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.RestoreLinkDeleteArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<RestoreLink | null>,
      Promise<Result<Prisma.RestoreLinkGetPayload<T> | null>>
    >
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

  public abstract userDelete<T extends Prisma.UserDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserDeleteArgs>
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

  public abstract phraseDeleteMany<T extends Prisma.PhraseDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseDeleteManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<Phrase>>,
      Promise<Result<Array<Prisma.PhraseGetPayload<any>>>>
    >
  >;

  public abstract phraseUpdateMany<T extends Prisma.PhraseUpdateManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseUpdateManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<Phrase>>,
      Promise<Result<Array<Prisma.PhraseGetPayload<any>>>>
    >
  >;

  public abstract phraseTagDeleteMany<T extends Prisma.PhraseTagDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseTagDeleteManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<Phrase>>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Promise<Result<Array<Prisma.PhraseGetPayload<any>>>>
    >
  >;

  public abstract phraseFindFirst<T extends Prisma.PhraseFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.PhraseFindFirstArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Phrase | null>, Promise<Result<Prisma.PhraseGetPayload<T> | null>>>
  >;

  public abstract onlineStatisticAggregate<T extends Prisma.OnlineStatisticAggregateArgs>(
    args: Prisma.Subset<T, Prisma.OnlineStatisticAggregateArgs>
  ): Promise<Result<Prisma.GetOnlineStatisticAggregateType<T> | null>>;

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

  public abstract onlineStatisticCreate<T extends Prisma.OnlineStatisticCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.OnlineStatisticCreateArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<OnlineStatistic | null>,
      Promise<Result<Prisma.OnlineStatisticGetPayload<T> | null>>
    >
  >;

  public abstract onlineStatisticFindFirst<T extends Prisma.OnlineStatisticFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.OnlineStatisticFindFirstArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<OnlineStatistic | null>,
      Promise<Result<Prisma.OnlineStatisticGetPayload<T> | null>>
    >
  >;

  public abstract onlineStatisticUpdate<T extends Prisma.OnlineStatisticUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.OnlineStatisticUpdateArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<OnlineStatistic | null>,
      Promise<Result<Prisma.OnlineStatisticGetPayload<T> | null>>
    >
  >;

  public abstract onlineStatisticDelete<T extends Prisma.OnlineStatisticDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.OnlineStatisticDeleteArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<OnlineStatistic | null>,
      Promise<Result<Prisma.OnlineStatisticGetPayload<T> | null>>
    >
  >;

  public abstract onlineStatisticFindMany<T extends Prisma.OnlineStatisticFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.OnlineStatisticFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<OnlineStatistic>>,
      Promise<Result<Array<Prisma.OnlineStatisticGetPayload<T>>>>
    >
  >;

  public abstract selectorFindMany<T extends Prisma.SelectorFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.SelectorFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<Selector>>,
      Promise<Result<Array<Prisma.SelectorGetPayload<T>>>>
    >
  >;

  public abstract selectorDeleteMany<T extends Prisma.SelectorDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.SelectorDeleteManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<Selector>>,
      Promise<Result<Array<Prisma.SelectorGetPayload<any>>>>
    >
  >;

  public abstract selectorCreate<T extends Prisma.SelectorCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.SelectorCreateArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Selector | null>,
      Promise<Result<Prisma.SelectorGetPayload<T> | null>>
    >
  >;

  public abstract pushNotificationFindMany<T extends Prisma.PushNotificationFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PushNotificationFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<PushNotification>>,
      Promise<Result<Array<Prisma.PushNotificationGetPayload<T>>>>
    >
  >;
}

export default Database;
