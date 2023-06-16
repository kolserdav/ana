import { Page, Prisma } from '@prisma/client';
import {
  Api,
  LOCALE_DEFAULT,
  LANGUAGE_HEADER,
  Locale,
  Result,
  USER_ID_HEADER,
  TIMEOUT_HEADER,
  AUTHORIZATION_HEADER,
  APPLICATION_JSON,
  UserCleanResult,
  CheckEmailQuery,
  CheckEmailResult,
  UserLoginBody,
  UserLoginResult,
  UserCreateBody,
  ForgotPasswordBody,
  ForgotPasswordResult,
  CheckRestoreKeyQuery,
  CheckRestoreKeyResult,
  RestorePasswordBody,
  RestorePasswordResult,
  ConfirmEmailBody,
  ConfirmEmailResult,
  PhraseCreateBody,
  PhraseCreateResult,
  TagCreateBody,
  TagCreateResult,
  TagFindManyQuery,
  TagFindManyResult,
  PhraseFindManyQuery,
  PhraseFindManyResult,
  PhraseDeleteBody,
  PhraseDeleteResult,
  PhraseUpdateBody,
  PhraseUpdateResult,
  PhraseFindFirstResult,
  PhraseFindFirstQuery,
  TagDeleteBody,
  TagDeleteResult,
  TagUpdateBody,
  TagUpdateResult,
  CSRF_HEADER,
  UserUpdateBody,
  UserDeleteBody,
  PhraseFindByTextQuery,
  PhraseFindByTextResult,
  PhraseDistinctQuery,
  PhraseDistinctResult,
  QUERY_STRING_ARRAY_SPLITTER,
  PhraseDeleteManyBody,
  PhraseDeleteManyResult,
  SendConfirmEmailBody,
  SendConfirmEmailResult,
  SupportBody,
  SupportResult,
  GetStatisticsQuery,
  GetStatisticsResult,
} from '../types/interfaces';
import { SERVER } from './constants';
import { CookieName, getCookie } from './cookies';
import { log } from './lib';
import { ServerLanguage, TranslateResult } from '../types';

class Request {
  protocol: string;

  constructor() {
    this.protocol = `${typeof window !== 'undefined' ? window.location.protocol : 'http:'}//`;
  }

  // eslint-disable-next-line class-methods-use-this
  private async send({
    body: _body,
    url,
    locale,
    method,
    connId,
    contentType = APPLICATION_JSON,
  }: {
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    locale?: string;
    contentType?: string | null;
    connId?: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    return new Promise((resolve) => {
      log('info', 'Send request', { method, url });
      const headers: RequestInit['headers'] = {
        [LANGUAGE_HEADER]: getCookie(CookieName.lang) || locale || LOCALE_DEFAULT,
        [USER_ID_HEADER]: getCookie(CookieName._uuid) || '',
        [AUTHORIZATION_HEADER]: getCookie(CookieName._utoken) || '',
        [TIMEOUT_HEADER]: new Date().getTime().toString(),
        [CSRF_HEADER]: connId || '',
      };
      if (contentType !== null) {
        headers['Content-Type'] = contentType || APPLICATION_JSON;
      }
      const body = _body
        ? contentType === APPLICATION_JSON
          ? JSON.stringify(_body)
          : _body
        : undefined;
      fetch(`${SERVER}${url}`, {
        body,
        method,
        headers,
      })
        .then((d) => {
          resolve(d.json());
        })
        .catch((err) => {
          log('error', 'Request error', { err, SERVER, url });
          resolve({
            status: 'error',
            message: 'No internet',
            data: null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as Result<any>);
        });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async test(): Promise<any> {
    return this.send({ url: Api.testV1, method: 'GET' });
  }

  public async getLocale<T extends keyof Locale['app']>({
    field,
    locale,
  }: {
    field: T;
    locale: string | undefined;
  }): Promise<Result<Locale['app'][T]>> {
    return this.send({ url: `${Api.getLocaleV1}?field=${field}`, locale, method: 'GET' });
  }

  public async getUser(): Promise<Result<UserCleanResult>> {
    return this.send({ url: Api.getUserFindFirst, method: 'GET' });
  }

  public async pageFindMany<T extends Prisma.PageFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PageFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Array<Page>>, Promise<Result<Array<Prisma.PageGetPayload<T>>>>>
  > {
    return this.send({ url: Api.postPageFindManyV1, method: 'POST', body: args });
  }

  public async checkEmail({ email }: CheckEmailQuery): Promise<Result<CheckEmailResult>> {
    return this.send({
      url: `${Api.getCheckEmail}?email=${email}`,
      method: 'GET',
    });
  }

  public async checkRestoreKey({
    email,
    key,
  }: CheckRestoreKeyQuery): Promise<Result<CheckRestoreKeyResult>> {
    return this.send({
      url: `${Api.getCheckRestoreKey}?email=${email}&key=${key}`,
      method: 'GET',
    });
  }

  public async userLogin(body: UserLoginBody): Promise<Result<UserLoginResult | null>> {
    return this.send({
      url: Api.postUserLogin,
      method: 'POST',
      body,
    });
  }

  public async confirmEmail(body: ConfirmEmailBody): Promise<Result<ConfirmEmailResult | null>> {
    return this.send({
      url: Api.putConfirmEmail,
      method: 'PUT',
      body,
    });
  }

  public async restorePassword(
    body: RestorePasswordBody
  ): Promise<Result<RestorePasswordResult | null>> {
    return this.send({
      url: Api.postRestorePassword,
      method: 'POST',
      body,
    });
  }

  public async userCreate(body: UserCreateBody): Promise<Result<UserCleanResult | null>> {
    return this.send({
      url: Api.postUserCreateV1,
      method: 'POST',
      body,
    });
  }

  public async userUpdate(body: UserUpdateBody): Promise<Result<UserCleanResult | null>> {
    return this.send({
      url: Api.putUserUpdate,
      method: 'PUT',
      body,
    });
  }

  public async userDelete(body: UserDeleteBody): Promise<Result<UserCleanResult | null>> {
    return this.send({
      url: Api.deleteUserDelete,
      method: 'DELETE',
      body,
    });
  }

  public async forgotPassword(
    body: ForgotPasswordBody
  ): Promise<Result<ForgotPasswordResult | null>> {
    return this.send({
      url: Api.postForgotPassword,
      method: 'POST',
      body,
    });
  }

  public async phraseCreate(body: PhraseCreateBody): Promise<Result<PhraseCreateResult>> {
    return this.send({
      url: Api.postPhraseCreate,
      method: 'POST',
      body,
    });
  }

  public async phraseDelete(body: PhraseDeleteBody): Promise<Result<PhraseDeleteResult>> {
    return this.send({
      url: Api.deletePhrase,
      method: 'DELETE',
      body,
    });
  }

  public async phraseDeleteMany(
    body: PhraseDeleteManyBody
  ): Promise<Result<PhraseDeleteManyResult>> {
    return this.send({
      url: Api.deletePhraseDeleteMany,
      method: 'DELETE',
      body,
    });
  }

  public async phraseFindFirst({
    phraseId,
  }: PhraseFindFirstQuery): Promise<Result<PhraseFindFirstResult>> {
    return this.send({
      url: `${Api.getPhrase}?phraseId=${phraseId}`,
      method: 'GET',
    });
  }

  public async phraseDistinct({
    distinct,
  }: PhraseDistinctQuery): Promise<Result<PhraseDistinctResult>> {
    return this.send({
      url: `${Api.getPhraseDistinct}?distinct=${(distinct as string[]).join(
        QUERY_STRING_ARRAY_SPLITTER
      )}`,
      method: 'GET',
    });
  }

  public async phraseFindByText({
    text,
  }: PhraseFindByTextQuery): Promise<Result<PhraseFindByTextResult>> {
    return this.send({
      url: `${Api.getPhraseFindByText}?text=${text}`,
      method: 'GET',
    });
  }

  public async phraseUpdate(body: PhraseUpdateBody): Promise<Result<PhraseUpdateResult>> {
    return this.send({
      url: Api.putPhrase,
      method: 'PUT',
      body,
    });
  }

  public async tagCreate(body: TagCreateBody): Promise<Result<TagCreateResult>> {
    return this.send({
      url: Api.postTagCreate,
      method: 'POST',
      body,
    });
  }

  public async support(body: SupportBody): Promise<Result<SupportResult>> {
    return this.send({
      url: Api.postSupport,
      method: 'POST',
      body,
    });
  }

  public async sendConfirmEmail(
    body: SendConfirmEmailBody
  ): Promise<Result<SendConfirmEmailResult>> {
    return this.send({
      url: Api.postSendConfirmEmail,
      method: 'POST',
      body,
    });
  }

  public async tagDelete(body: TagDeleteBody): Promise<Result<TagDeleteResult>> {
    return this.send({
      url: Api.deleteTag,
      method: 'DELETE',
      body,
    });
  }

  public async tagUpdate(body: TagUpdateBody): Promise<Result<TagUpdateResult>> {
    return this.send({
      url: Api.putTag,
      method: 'PUT',
      body,
    });
  }

  public async getStatistics({
    userId,
    gt,
    dateFilter,
  }: GetStatisticsQuery): Promise<Result<GetStatisticsResult>> {
    return this.send({
      url: `${Api.getStatistics}?userId=${userId}&gt=${gt}&dateFilter=${dateFilter}`,
      method: 'GET',
    });
  }

  public async tagFindMany(query: TagFindManyQuery): Promise<Result<TagFindManyResult>> {
    return this.send({
      url: Api.getTagsFindMany,
      method: 'GET',
    });
  }

  public async phraseFindMany({
    orderBy,
    skip,
    take,
    tags,
    strongTags,
    search,
    gt,
    learnLang,
  }: PhraseFindManyQuery): Promise<Result<PhraseFindManyResult>> {
    return this.send({
      url: `${Api.getPhraseFindMany}?search=${search}&orderBy=${orderBy}&skip=${skip}&take=${take}&tags=${tags}&strongTags=${strongTags}&gt=${gt}&learnLang=${learnLang}`,
      method: 'GET',
    });
  }

  public async translate({
    q,
    source,
    target,
    connId,
  }: {
    q: string;
    source: string;
    target: string;
    connId: string;
  }): Promise<TranslateResult> {
    return this.send({
      url: Api.translate,
      method: 'POST',
      connId,
      body: {
        q,
        source,
        target,
        format: 'text',
      },
    });
  }

  public async getLanguages(): Promise<ServerLanguage[]> {
    return this.send({
      url: Api.languages,
      method: 'GET',
    });
  }
}

export default Request;
