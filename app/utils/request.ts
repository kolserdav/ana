import { Api, DEFAULT_LOCALE, Locale, LocaleValue } from '@/types/interfaces';
import { SERVER } from './constants';
import { CookieName, getCookie } from './cookies';
import { log } from './lib';

class Request {
  protocol: string;

  constructor() {
    this.protocol = `${typeof window !== 'undefined' ? window.location.protocol : 'http:'}//`;
  }

  // eslint-disable-next-line class-methods-use-this
  private async send<T>({ url, locale }: { url: string; locale?: string }): Promise<1 | T> {
    return new Promise((resolve) => {
      log('log', 'Send request', { url });
      fetch(`${SERVER}${url}`, {
        headers: { 'accept-language': getCookie(CookieName.lang) || locale || DEFAULT_LOCALE },
      })
        .then((d) => {
          resolve(d.json());
        })
        .catch((err) => {
          log('error', 'Request error', err);
          resolve(1);
        });
    });
  }

  public test(id: string) {
    return this.send({ url: `${Api.testV1}?id=${id}` });
  }

  public async getLocale<T extends keyof Locale['app']>({
    field,
    locale,
  }: {
    field: keyof Locale['app'];
    locale: string | undefined;
  }): Promise<1 | Locale['app'][T]> {
    return this.send({ url: `${Api.getLocaleV1}?field=${field}`, locale });
  }
}

export default Request;
