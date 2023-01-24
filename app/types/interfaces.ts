/* eslint-disable no-unused-vars */

// eslint-disable-next-line no-shadow
export enum LogLevel {
  log = 0,
  info = 1,
  warn = 2,
  error = 3,
}

// eslint-disable-next-line no-shadow
export enum MessageType {
  TEST = 'TEST',
  SET_CONNECTION_ID = 'SET_CONNECTION_ID',
  SET_ERROR = 'SET_ERROR',
}

export type WSProtocol = 'home';
export const DEFAULT_LOCALE: LocaleValue = 'ru';

export type ArgsSubset<T extends keyof typeof MessageType> = T extends MessageType.TEST
  ? { ok: 'yes' | 'no' }
  : T extends MessageType.SET_CONNECTION_ID
  ? null
  : never;

export interface SendMessageArgs<T extends keyof typeof MessageType> {
  type: T;
  id: string;
  data: ArgsSubset<T>;
}

export type LocaleValue = 'ru';

export interface Locale {
  server: {
    error: string;
    badRequest: string;
  };
  app: {
    login: {
      email: string;
      name: string;
      login: string;
      register: string;
    };
  };
}

export enum Api {
  testV1 = '/v1/test',
  getLocaleV1 = '/v1/get-locale',
}

export function checkEmail(email: string): boolean {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    email
  );
}
