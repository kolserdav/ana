/* eslint-disable no-unused-vars */

import { Prisma, PrismaClient, Role, User, File } from '@prisma/client';

// eslint-disable-next-line no-shadow
export enum LogLevel {
  info = 0,
  warn = 1,
  error = 2,
}

export const PAGE_RESTORE_PASSWORD_CALLBACK = '/account/restore-callback';
export const PAGE_CONFIRM_EMAIL = '/account/confirm-email';
export const EMAIL_QS = 'e';
export const KEY_QS = 'k';
export const CLOUD_PREFIX = '/cloud';
export const IMAGE_EXT = '.avif';
export const IMAGE_PREV_POSTFIX = '-preview';

// eslint-disable-next-line no-shadow
export enum MessageType {
  // Test
  TEST = 'TEST',
  // Database
  DB_COMMAND = 'DB_COMMAND',
  DB_RESULT = 'DB_RESULT',
  // WebSocket
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
  GET_CHECK_RESTORE_KEY = 'GET_CHECK_RESTORE_KEY',
  SET_CHECK_RESTORE_KEY = 'SET_CHECK_RESTORE_KEY',
  GET_RESTORE_PASSWORD = 'GET_RESTORE_PASSWORD',
  SET_RESTORE_PASSWORD = 'SET_RESTORE_PASSWORD',
  GET_CONFIRM_EMAIL = 'GET_CONFIRM_EMAIL',
  SET_CONFIRM_EMAIL = 'SET_CONFIRM_EMAIL',
  // HTTP
  AUTH = 'AUTH',
  GET_USER_FIND_FIRST = 'GET_USER_FIND_FIRST',
  SET_USER_FIND_FIRST = 'SET_USER_FIND_FIRST',
  GET_FILE_UPLOAD = 'GET_FILE_UPLOAD',
  SET_FILE_UPLOAD = 'SET_FILE_UPLOAD',
  GET_FILE_FIND_MANY = 'GET_FILE_FIND_MANY',
  SET_FILE_FIND_MANY = 'SET_FILE_FIND_MANY',
  GET_FILE_DELETE = 'GET_FILE_DELETE',
  SET_FILE_DELETE = 'SET_FILE_DELETE',
}
export type LocaleValue = 'ru';
export interface RequestContext {
  lang: LocaleValue;
  timeout: number;
}

export interface DBCommandProps {
  model: keyof PrismaClient;
  command: Prisma.PrismaAction;
  args: Prisma.SelectSubset<any, any>;
}
export type Status = 'error' | 'warn' | 'info';
export interface Result<T> {
  status: Status;
  message: string;
  data: T;
  code: number;
  stdErrMessage?: string;
  _model?: keyof PrismaClient;
  _command?: Prisma.PrismaAction;
  skip?: number | undefined;
  take?: number | undefined;
  count?: number | undefined;
}

export type DBResult<T> = Omit<Result<T>, 'message'>;

export type ArgsSubset<T extends keyof typeof MessageType> = T extends MessageType.TEST
  ? { ok: 'yes' | 'no' }
  : // Database
  T extends MessageType.DB_COMMAND
  ? DBCommandProps
  : T extends MessageType.DB_RESULT
  ? DBResult<any>
  : // WebSocket
  T extends MessageType.SET_CONNECTION_ID
  ? null
  : T extends MessageType.GET_USER_CREATE
  ? Omit<Prisma.UserCreateArgs['data'], 'salt'>
  : T extends MessageType.SET_USER_CREATE
  ? User | null
  : T extends MessageType.SET_ERROR
  ? {
      type: keyof typeof MessageType;
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
      userId: string;
    }
  : T extends MessageType.GET_FORGOT_PASSWORD
  ? {
      email: string;
    }
  : T extends MessageType.SET_FORGOT_PASSWORD
  ? {
      message: string;
    }
  : T extends MessageType.GET_CHECK_RESTORE_KEY
  ? {
      email: string;
      key: string;
    }
  : T extends MessageType.SET_CHECK_RESTORE_KEY
  ? null
  : T extends MessageType.GET_RESTORE_PASSWORD
  ? {
      email: string;
      key: string;
      password: string;
    }
  : T extends MessageType.SET_RESTORE_PASSWORD
  ? null
  : T extends MessageType.GET_CONFIRM_EMAIL
  ? {
      email: string;
      key: string;
    }
  : T extends MessageType.SET_CONFIRM_EMAIL
  ? {
      message: string;
    }
  : // HTTP
  T extends MessageType.GET_USER_FIND_FIRST
  ? Prisma.UserFindFirstArgs
  : T extends MessageType.SET_USER_FIND_FIRST
  ? Omit<User, 'password' | 'salt'> | null
  : T extends MessageType.GET_FILE_UPLOAD
  ? {
      filePath: string;
      file: File;
    }
  : T extends MessageType.SET_FILE_UPLOAD
  ? null | File
  : T extends MessageType.GET_FILE_FIND_MANY
  ? Prisma.FileFindManyArgs
  : T extends MessageType.SET_FILE_FIND_MANY
  ? File[]
  : T extends MessageType.GET_FILE_DELETE
  ? Prisma.FileDeleteArgs
  : T extends MessageType.SET_FILE_DELETE
  ? null
  : unknown;

export interface Tab {
  id: number;
  value: Role;
  title: string;
  content: string;
}

export interface SendMessageArgs<T extends keyof typeof MessageType> extends RequestContext {
  type: T;
  id: string;
  data: ArgsSubset<T>;
  connId?: string;
}

export interface Locale {
  server: {
    error: string;
    badRequest: string;
    notFound: string;
    success: string;
    wrongPassword: string;
    emailIsSend: string;
    linkExpired: string;
    linkUnaccepted: string;
    letterNotSend: string;
    successConfirmEmail: string;
    forbidden: string;
    unauthorized: string;
    someFilesNotSaved: string;
    notImplement: string;
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
      wrongParameters: string;
      sendNewLetter: string;
    };
    appBar: {
      darkTheme: string;
      homePage: string;
      login: string;
      logout: string;
      personalArea: string;
      createProject: string;
    };
    confirmEmail: {
      title: string;
      paramsNotFound: string;
    };
    me: {
      createProject: string;
      projectTitle: string;
      projectDescription: string;
      projectDesPlaceholder: string;
      projectActualFor: string;
      projectAddFiles: string;
      projectAddFilesDesc: string;
      projectDragDropFiles: string;
      projectDateTooltip: string;
    };
    common: {
      formDesc: string;
      showHelp: string;
    };
  };
}

// eslint-disable-next-line no-shadow
export enum Api {
  testV1 = '/v1/test',
  getLocaleV1 = '/v1/get-locale',
  postPageFindManyV1 = '/v1/page-get-fields',
  postUserCreateV1 = '/v1/user-create',
  getUserFindFirst = '/v1/user-find-first',
  postFileUpload = '/v1/file-upload',
  deleteFileDelete = '/v1/file-delete',
  getFileFindMany = '/v1/file-find-many',
}

export interface FileDeleteBody {
  fileId: string;
}

export type WSProtocol = 'test' | 'login' | 'confirm-email';
export const LOCALE_DEFAULT: LocaleValue = 'ru';
export const LANGUAGE_HEADER = 'lang';
export const USER_ID_HEADER = 'uuid';
export const AUTHORIZATION_HEADER = 'authorization';
export const TIMEOUT_HEADER = 'timeout';
export const APPLICATION_JSON = 'application/json';
export const PREVIEW_IMAGE_WIDTH = 320;

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
