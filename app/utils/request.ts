import { Api, DEFAULT_LOCALE, LANGUAGE_HEADER, Locale, Result } from '@/types/interfaces';
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
    locale,
    method,
  }: {
    url: string;
    body?: any;
    locale?: string;
    method: 'GET' | 'POST' | 'UPDATE' | 'DELETE';
  }): Promise<any> {
    return new Promise((resolve) => {
      log('log', 'Send request', { url });
      fetch(`${SERVER}${url}`, {
        body,
        method,
        headers: { [LANGUAGE_HEADER]: getCookie(CookieName.lang) || locale || DEFAULT_LOCALE },
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
          });
        });
    });
  }

  public test(id: string) {
    return this.send({ url: `${Api.testV1}?id=${id}`, method: 'GET' });
  }

  public async getLocale<T extends keyof Locale['app']>({
    field,
    locale,
  }: {
    field: keyof Locale['app'];
    locale: string | undefined;
  }): Promise<1 | Locale['app'][T]> {
    return this.send({ url: `${Api.getLocaleV1}?field=${field}`, locale, method: 'GET' });
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
