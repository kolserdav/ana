import { DEFAULT_LOCALE, LocaleValue } from '@/types/interfaces';
import { Cookies } from 'react-cookie';
import { isTest } from './lib';

const cookies = new Cookies();

// eslint-disable-next-line no-shadow
export enum CookieName {
  // eslint-disable-next-line no-unused-vars
  lang = 'lang',
  // eslint-disable-next-line no-unused-vars
  _utoken = '_utoken',
}

type CookieValue<T extends keyof typeof CookieName> = T extends CookieName.lang
  ? LocaleValue
  : T extends CookieName._utoken
  ? string
  : never;

export function getCookie<T extends keyof typeof CookieName>(name: T): CookieValue<T> | null {
  const _cookies = cookies.get(name);
  return _cookies || null;
}

export function setCookie<T extends keyof typeof CookieName>(
  name: T,
  value: CookieValue<T>,
  options?: {
    expires?: Date;
  }
) {
  let date;
  if (options) {
    const { expires } = options;
    date = expires;
  }
  if (!options?.expires) {
    date = new Date();
    date.setFullYear(date.getFullYear() + 1);
  }
  cookies.set(name, value, {
    expires: date,
    path: '/',
    sameSite: true,
    secure: !isTest(),
  });
}

export const cleanCookie = (name: CookieName) => {
  const expires = new Date();
  expires.setMonth(expires.getMonth() - 1);
  setCookie(name, '' as never, { expires });
};

export const getLangCookie = () => getCookie(CookieName.lang) || DEFAULT_LOCALE;
