/* eslint-disable no-unused-vars */

import { Prisma, PrismaClient, User } from '@prisma/client';

// eslint-disable-next-line no-shadow
export enum Api {
  testV1 = '/v1/test',
  getLocaleV1 = '/v1/get-locale',
  postPageFindManyV1 = '/v1/page-get-fields',
  postUserCreateV1 = '/v1/user-create',
  getUserFindFirst = '/v1/user-find-first',
  postUserLogin = '/v1/user-login',
  getCheckEmail = '/v1/check-email',
}

// eslint-disable-next-line no-shadow
export enum LogLevel {
  info = 0,
  warn = 1,
  error = 2,
}
export type LocaleValue = 'ru';
export const PAGE_RESTORE_PASSWORD_CALLBACK = '/account/restore-callback';
export const PAGE_CONFIRM_EMAIL = '/account/confirm-email';
export const EMAIL_QS = 'e';
export const KEY_QS = 'k';
export const CLOUD_PREFIX = '/cloud';
export const IMAGE_EXT = '.avif';
export const IMAGE_PREV_POSTFIX = '-preview';
export type WSProtocol = 'test' | 'login' | 'confirm-email' | 'app';
export const LOCALE_DEFAULT: LocaleValue = 'ru';
export const LANGUAGE_HEADER = 'lang';
export const USER_ID_HEADER = 'uuid';
export const AUTHORIZATION_HEADER = 'authorization';
export const TIMEOUT_HEADER = 'timeout';
export const APPLICATION_JSON = 'application/json';
export const PREVIEW_IMAGE_WIDTH = 320;
export const IMAGE_EXTS = '.avif, .jpg, .jpeg, .gif, .png, .webp';
export const MAX_BODY_MB = 5;

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
  code?: number;
  stdErrMessage?: string;
  _model?: keyof PrismaClient;
  _command?: Prisma.PrismaAction;
  skip?: number | undefined;
  take?: number | undefined;
  count?: number | undefined;
}

export interface ManyResult<T> {
  items: T[];
  skip?: number | undefined;
  take?: number | undefined;
  count?: number | undefined;
}

export type DBResult<T> = Omit<Result<T>, 'message'>;

export type FullUserName = { name: string; surname: string };

export interface UserLoginBody {
  email: string;
  password: string;
}

export type UserCleanResult = Omit<User, 'password' | 'salt'>;

export interface UserLoginResult {
  token: string;
  userId: string;
}

export interface CheckEmailQuery {
  email: string;
}
export type CheckEmailResult = boolean;

export interface UserCreateBody {
  email: string;
  password: string;
  name?: string;
}

export type ArgsSubset<T extends keyof typeof MessageType> = T extends MessageType.TEST
  ? { ok: 'yes' | 'no' }
  : // Database
  T extends MessageType.DB_COMMAND
  ? DBCommandProps
  : T extends MessageType.DB_RESULT
  ? DBResult<any>
  : // WebSocket
  T extends MessageType.SET_CONNECTION_ID
  ? null | string
  : T extends MessageType.GET_CONNECTION_ID
  ? { newId: string }
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
  : unknown;

export interface Tab {
  id: number;
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
    linkExpired: string;
    linkUnaccepted: string;
    letterNotSend: string;
    successConfirmEmail: string;
    forbidden: string;
    unauthorized: string;
    someFilesNotSaved: string;
    notImplement: string;
    unacceptedImage: string;
    maxFileSize: string;
    projectCreateButFilesNotSaved: string;
    sendToSupport: string;
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
      passwordsDoNotMatch: string;
      passwordMinLengthIs: string;
      passwordMustContain: string;
      number: string;
      letter: string;
      emailIsUnacceptable: string;
      neededSelect: string;
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
      myProjects: string;
      projectsIsMissing: string;
      files: string;
    };
    createProject: {
      createProject: string;
      projectTitle: string;
      projectDescription: string;
      projectDesPlaceholder: string;
      projectActualFor: string;
      projectAddFilesDesc: string;
      projectDragDropFiles: string;
      projectDateTooltip: string;
      withoutCategory: string;
      maxFileSizeIs: string;
      categoryHelp: string;
      categoryLabel: string;
      buttonCreate: string;
      projectCreated: string;
    };
    common: {
      formDesc: string;
      showHelp: string;
      somethingWentWrong: string;
      maxFileSize: string;
      fieldMustBeNotEmpty: string;
      eliminateRemarks: string;
      projectAddFiles: string;
    };
    projectStatus: {
      waitEmployer: string;
      waitWorker: string;
      agreementOfConditions: string;
      inWork: string;
      finished: string;
    };
  };
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

export const isImage = (mimetype: string) => /^image\//.test(mimetype);

export const getFileExt = (filename: string): string => {
  const fileE = filename.match(/\.[a-zA-Z0-9]{1,4}$/);
  if (!fileE) {
    return '';
  }
  if (!fileE[0]) {
    return '';
  }
  return fileE[0];
};

export const getMaxBodySize = () => 1024 * 1024 * MAX_BODY_MB;
