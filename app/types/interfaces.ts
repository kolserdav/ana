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

export type ArgsSubset<T extends keyof typeof MessageType> = T extends MessageType.TEST
  ? { ok: 'yes' | 'no' }
  : T extends MessageType.SET_CONNECTION_ID
  ? null
  : never;

export interface Locale {
  server: {
    error: string;
    badRequest: string;
    notFound: string;
    success: string;
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

// eslint-disable-next-line no-shadow
export enum Api {
  testV1 = '/v1/test',
  getLocaleV1 = '/v1/get-locale',
}

export type Status = 'error' | 'warning' | 'success';

export interface Result<T> {
  status: Status;
  message: string;
  data: T;
  stdErrMessage?: string;
  skip?: number | undefined;
  take?: number | undefined;
  count?: number | undefined;
}

export type LocaleValue = 'ru';
export type WSProtocol = 'home';
export const DEFAULT_LOCALE: LocaleValue = 'ru';
export interface SendMessageArgs<T extends keyof typeof MessageType> {
  type: T;
  id: string;
  lang: LocaleValue;
  data: ArgsSubset<T>;
}

export function checkEmail(email: string): boolean {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    email
  );
}
