import {
  Api,
  LOCALE_DEFAULT,
  LANGUAGE_HEADER,
  Locale,
  Result,
  USER_ID_HEADER,
  SendMessageArgs,
  MessageType,
} from '@/types/interfaces';
import { Page, Prisma, PrismaPromise } from '@prisma/client';
import { SERVER } from './constants';
import { CookieName, getCookie } from './cookies';
import { log } from './lib';

class Request {
  protocol: string;

  constructor() {
    this.protocol = `${typeof window !== 'undefined' ? window.location.protocol : 'http:'}//`;
  }

  // eslint-disable-next-line class-methods-use-this
  private async send({
    body,
    url,
    id,
    locale,
    method,
  }: {
    url: string;
    id?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    locale?: string;
    method: 'GET' | 'POST' | 'UPDATE' | 'DELETE';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    return new Promise((resolve) => {
      log('info', 'Send request', { method, url });
      fetch(`${SERVER}${url}`, {
        body: body ? JSON.stringify(body) : undefined,
        method,
        headers: {
          [LANGUAGE_HEADER]: getCookie(CookieName.lang) || locale || LOCALE_DEFAULT,
          [USER_ID_HEADER]: id || getCookie(CookieName._uuid) || '',
          'Content-Type': 'application/json',
        },
      })
        .then((d) => {
          resolve(d.json());
        })
        .catch((err) => {
          log('error', 'Request error', err);
          resolve({
            status: 'error',
            message: 'Internet error',
            code: 503,
            data: null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as Result<any>);
        });
    });
  }

  public async test(id: string): Promise<SendMessageArgs<MessageType.TEST>> {
    return this.send({ url: Api.testV1, method: 'GET', id });
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

  public async getUser(): Promise<SendMessageArgs<MessageType.SET_USER_FIND_FIRST>> {
    return this.send({ url: Api.getUserFindFirst, method: 'GET' });
  }

  public async pageFindMany<T extends Prisma.PageFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PageFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<
      T,
      Result<Array<Page>>,
      PrismaPromise<Result<Array<Prisma.PageGetPayload<T>>>>
    >
  > {
    return this.send({ url: Api.postPageFindManyV1, method: 'POST', body: args });
  }
}

export default Request;
