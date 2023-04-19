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
    contentType = APPLICATION_JSON,
  }: {
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    locale?: string;
    contentType?: string | null;
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

  public async tagCreate(body: TagCreateBody): Promise<Result<TagCreateResult>> {
    return this.send({
      url: Api.postTagCreate,
      method: 'POST',
      body,
    });
  }

  public async tagFindMany(query: TagFindManyQuery): Promise<Result<TagFindManyResult>> {
    return this.send({
      url: Api.getTagsFindMany,
      method: 'GET',
    });
  }

  public async phraseFindMany(query: PhraseFindManyQuery): Promise<Result<PhraseFindManyResult>> {
    return this.send({
      url: Api.getPhraseFindMany,
      method: 'GET',
    });
  }

  public async translate({
    q,
    source,
    target,
  }: {
    q: string;
    source: string;
    target: string;
  }): Promise<TranslateResult> {
    return this.send({
      url: '/libre/translate',
      method: 'POST',
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
      url: '/libre/languages',
      method: 'GET',
    });
  }
}

export default Request;
