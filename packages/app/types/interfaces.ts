/* eslint-disable no-unused-vars */

import {
  Prisma,
  PrismaClient,
  Role,
  User,
  File,
  Category,
  Subcategory,
  Project,
  ProjectEvent,
  ProjectMessage,
} from '@prisma/client';

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
  categoryFindMany = '/v1/category-find-many',
  projectCreate = '/v1/project-create',
  projectFindMany = '/v1/project-find-many',
  projectFindFirst = '/v1/project-find-first',
  projectGive = '/v1/project-give',
  postProjectMessage = '/v1/post-project-message',
  projectMessageFindMany = '/v1/project-messsage-find-many',
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

// eslint-disable-next-line no-shadow
export enum MessageType {
  // Test
  TEST = 'TEST',
  // Database
  DB_COMMAND = 'DB_COMMAND',
  DB_RESULT = 'DB_RESULT',
  // WebSocket
  SET_CONNECTION_ID = 'SET_CONNECTION_ID',
  GET_CONNECTION_ID = 'GET_CONNECTION_ID',
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
  SET_CATEGORY_FIND_MANY = 'SET_CATEGORY_FIND_MANY',
  GET_PROJECT_CREATE = 'GET_PROJECT_CREATE',
  SET_PROJECT_CREATE = 'SET_PROJECT_CREATE',
  GET_PROJECT_FIND_MANY = 'GET_PROJECT_FIND_MANY',
  SET_PROJECT_FIND_MANY = 'SET_PROJECT_FIND_MANY',
  GET_PROJECT_FIND_FIRST = 'GET_PROJECT_FIND_FIRST',
  SET_PROJECT_FIND_FIRST = 'SET_PROJECT_FIND_FIRST',
  GET_GIVE_PROJECT = 'GET_GIVE_PROJECT',
  SET_GIVE_PROJECT = 'SET_GIVE_PROJECT',
  GET_POST_PROJECT_MESSAGE = 'GET_POST_PROJECT_MESSAGE',
  SET_POST_PROJECT_MESSAGE = 'SET_POST_PROJECT_MESSAGE',
  GET_PROJECT_MESSAGE_FIND_MANY = 'GET_PROJECT_MESSAGE_FIND_MANY',
  SET_PROJECT_MESSAGE_FIND_MANY = 'SET_PROJECT_MESSAGE_FIND_MANY',
}

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

export interface ManyResult<T> {
  items: T[];
  skip?: number | undefined;
  take?: number | undefined;
  count?: number | undefined;
}

export type DBResult<T> = Omit<Result<T>, 'message'>;

export interface ProjectCreateBody {
  title: string;
  description: string;
  endDate: string;
  files: string[];
  subcategories: number[];
}

export interface ProjectFindFirstQuery {
  id: string;
}

export interface ProjectPostMessageBody {
  projectId: string;
  content: string;
  fileId?: string;
}

export interface ProjectGiveBody {
  id: string;
}

export interface ProjectMessageFindManyQuery {
  projectId: string;
}

export interface FileDeleteBody {
  fileId: string;
}

export type FullUserName = { name: string; surname: string };

export type ProjectFull = Project & {
  File: File[];
  ProjectEvent: ProjectEvent[];
  Employer: FullUserName | null;
  Worker: FullUserName | null;
};
export type ProjectMessageFull = ProjectMessage & { File: File | null };

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
  ? Omit<User, 'password' | 'salt'>
  : T extends MessageType.GET_FILE_UPLOAD
  ? {
      filePath: string;
      file: File;
    }
  : T extends MessageType.SET_FILE_UPLOAD
  ? null
  : T extends MessageType.GET_FILE_FIND_MANY
  ? Prisma.FileFindManyArgs
  : T extends MessageType.SET_FILE_FIND_MANY
  ? File[]
  : T extends MessageType.GET_FILE_DELETE
  ? Prisma.FileDeleteArgs
  : T extends MessageType.SET_FILE_DELETE
  ? null
  : T extends MessageType.SET_CATEGORY_FIND_MANY
  ? (Category & { Subcategory: Subcategory[] })[]
  : T extends MessageType.GET_PROJECT_CREATE
  ? ProjectCreateBody
  : T extends MessageType.SET_PROJECT_CREATE
  ? Project
  : T extends MessageType.GET_PROJECT_FIND_MANY
  ? null
  : T extends MessageType.SET_PROJECT_FIND_MANY
  ? ManyResult<Project & { File: { id: string }[] }>
  : T extends MessageType.GET_PROJECT_FIND_FIRST
  ? ProjectFindFirstQuery
  : T extends MessageType.SET_PROJECT_FIND_FIRST
  ? ProjectFull
  : T extends MessageType.GET_GIVE_PROJECT
  ? ProjectGiveBody
  : T extends MessageType.SET_GIVE_PROJECT
  ? ProjectFull
  : T extends MessageType.GET_POST_PROJECT_MESSAGE
  ? ProjectPostMessageBody
  : T extends MessageType.SET_POST_PROJECT_MESSAGE
  ? ProjectMessageFull
  : T extends MessageType.GET_PROJECT_MESSAGE_FIND_MANY
  ? ProjectMessageFindManyQuery
  : T extends MessageType.SET_PROJECT_MESSAGE_FIND_MANY
  ? ManyResult<ProjectMessageFull>
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
  /**
   * Required in http request handler
   */
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
