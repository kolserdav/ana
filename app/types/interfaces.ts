/* eslint-disable no-unused-vars */

import { Prisma, Role, User } from '@prisma/client';

// eslint-disable-next-line no-shadow
export enum LogLevel {
  info = 0,
  warn = 1,
  error = 2,
}

export const PAGE_RESTORE_PASSWORD_CALLBACK = '/account/restore-callback';
export const EMAIL_QS = 'e';
export const KEY_QS = 'k';

// eslint-disable-next-line no-shadow
export enum MessageType {
  TEST = 'TEST',
  SET_CONNECTION_ID = 'SET_CONNECTION_ID',
  SET_ERROR = 'SET_ERROR',
  GET_USER_CREATE = 'GET_USER_CREATE',
  SET_USER_CREATE = 'SET_USER_CREATE',
  GET_USER_CHECK_EMAIL = 'GET_USER_CHECK_EMAIL',
  SET_USER_CHECK_EMAIL = 'SET_USER_CHECK_EMAIL',
  GET_USER_LOGIN = 'GET_USER_LOGIN',
  SET_USER_LOGIN = 'SET_USER_LOGIN',
  GET_FORGOT_PASSWORD = 'GET_FORGOT_PASSWORD',
  SET_FORGOT_PASSWORD = 'SET_FORGOT_PASSWORD',
}

// eslint-disable-next-line no-shadow
export enum ErrorCode {
  createUser = 'createUser',
  userCheckEmail = 'userCheckEmail',
  userLogin = 'userLogin',
  forgotPassword = 'forgotPassword',
}
export type Status = 'error' | 'warn' | 'info';
export type ArgsSubset<T extends keyof typeof MessageType> = T extends MessageType.TEST
  ? { ok: 'yes' | 'no' }
  : T extends MessageType.SET_CONNECTION_ID
  ? null
  : T extends MessageType.GET_USER_CREATE
  ? Omit<Prisma.UserCreateArgs['data'], 'salt'> & { passwordRepeat: string }
  : T extends MessageType.SET_USER_CREATE
  ? User | null
  : T extends MessageType.SET_ERROR
  ? {
      code: keyof typeof ErrorCode;
      message: string;
      status: Status;
      httpCode: number;
    }
  : T extends MessageType.GET_USER_CHECK_EMAIL
  ? {
      email: string;
    }
  : T extends MessageType.SET_USER_CHECK_EMAIL
  ? boolean
  : T extends MessageType.GET_USER_LOGIN
  ? {
      email: string;
      password: string;
    }
  : T extends MessageType.SET_USER_LOGIN
  ? {
      token: string;
    }
  : T extends MessageType.GET_FORGOT_PASSWORD
  ? {
      email: string;
    }
  : T extends MessageType.SET_FORGOT_PASSWORD
  ? {
      message: string;
    }
  : never;

export interface Tab {
  id: number;
  value: Role;
  title: string;
  content: string;
}

export interface Locale {
  server: {
    error: string;
    badRequest: string;
    notFound: string;
    success: string;
    wrongPassword: string;
    emailIsSend: string;
  };
  app: {
    login: {
      email: string;
      name: string;
      surname: string;
      register: string;
      loginButton: string;
      tabs: Tab[];
      tabDefault: string;
      signUp: string;
      signIn: string;
      accountType: string;
      formDesc: string;
      password: string;
      passwordRepeat: string;
      fieldProhibited: string;
      fieldMustBeNotEmpty: string;
      passwordsDoNotMatch: string;
      passwordMinLengthIs: string;
      passwordMustContain: string;
      number: string;
      letter: string;
      emailIsUnacceptable: string;
      neededSelect: string;
      eliminateRemarks: string;
      emailIsRegistered: string;
      emailIsNotRegistered: string;
      successLogin: string;
      successRegistration: string;
      forgotPassword: string;
      restorePassword: string;
      sendRestoreMail: string;
      restoreDesc: string;
      changePassword: string;
      newPassword: string;
      save: string;
    };
    appBar: {
      darkTheme: string;
      homePage: string;
      login: string;
      logout: string;
    };
  };
}

// eslint-disable-next-line no-shadow
export enum Api {
  testV1 = '/v1/test',
  getLocaleV1 = '/v1/get-locale',
  postPageFindManyV1 = '/v1/page-get-fields',
  postUserCreateV1 = '/v1/user-create',
}

export interface Result<T> {
  status: Status;
  message: string;
  data: T;
  code: number;
  stdErrMessage?: string;
  skip?: number | undefined;
  take?: number | undefined;
  count?: number | undefined;
}

export type LocaleValue = 'ru';
export type WSProtocol = 'test' | 'login';
export const LOCALE_DEFAULT: LocaleValue = 'ru';
export const LANGUAGE_HEADER = 'lang';
export const USER_ID_HEADER = 'uuid';
export interface SendMessageArgs<T extends keyof typeof MessageType> {
  type: T;
  id: string;
  lang: LocaleValue;
  timeout: number;
  data: ArgsSubset<T>;
}

export function checkEmail(email: string): boolean {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
    email
  );
}

export const parseQueryString = (query: string): Record<string, string> => {
  const arr = query.replace(/\??/, '').split('&');
  const res: Record<string, string> = {};
  arr.forEach((item) => {
    if (item === '') {
      return;
    }
    const propReg = /^\w+=/;
    const prop = item.match(propReg);
    const _prop = prop ? prop[0] : null;
    if (!_prop) {
      return;
    }
    const propStr = _prop.replace('=', '');
    res[propStr] = item.replace(propReg, '');
  });
  return res;
};
