/* eslint-disable no-unused-vars */

import { Phrase, PhraseTag, Prisma, PrismaClient, Tag, User } from '@prisma/client';

// eslint-disable-next-line no-shadow
export enum Api {
  testV1 = '/v1/test',
  getLocaleV1 = '/v1/get-locale',
  postPageFindManyV1 = '/v1/page-get-fields',
  postUserCreateV1 = '/v1/user-create',
  putConfirmEmail = '/v1/confirm-email',
  postRestorePassword = '/v1/restore-password',
  getUserFindFirst = '/v1/user-find-first',
  getCheckRestoreKey = '/v1/check-restore-key',
  deletePhrase = '/v1/phrase',
  postPhraseCreate = '/v1/phrase',
  getTagsFindMany = '/v1/tags-find-many',
  getPhraseFindMany = '/v1/phrase-find-many',
  postTagCreate = '/v1/tag-create',
  postForgotPassword = '/v1/forgot-password',
  postUserLogin = '/v1/user-login',
  getCheckEmail = '/v1/check-email',
  getLanguages = '/v1/languages',
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

export interface ProcessMessage<T> {
  id: string;
  msg: T;
}

export interface RequestContext {
  lang: LocaleValue;
  timeout: number;
}

export interface DBCommandProps {
  model: keyof PrismaClient;
  command: Prisma.PrismaAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface ForgotPasswordBody {
  email: string;
}

export type ForgotPasswordResult = null;

export interface CheckRestoreKeyQuery {
  email: string;
  key: string;
}
export type CheckRestoreKeyResult = boolean;

export interface RestorePasswordBody {
  email: string;
  key: string;
  password: string;
}
export type RestorePasswordResult = null;

export interface PhraseCreateBody {
  text: string;
  tags: string[];
  translate?: string;
}
export type PhraseCreateResult = Phrase | null;

export interface PhraseDeleteBody {
  phraseId: string;
}
export type PhraseDeleteResult = Phrase | null;

export interface TagCreateBody {
  text: string;
}
export type TagCreateResult = Tag | null;

export type TagFindManyQuery = void;
export type TagFindManyResult = Tag[];

export type PhraseFindManyQuery = void;
export type PhraseFindManyResult = (Phrase & { PhraseTag: (PhraseTag & { Tag: Tag })[] })[];

export interface ConfirmEmailBody {
  email: string;
  key: string;
}
export type ConfirmEmailResult = null;

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
    notImplement: string;
    sendToSupport: string;
    phraseSaved: string;
    tagExists: string;
    tagSaved: string;
    phraseDeleted: string;
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
      translate: string;
      myDictionary: string;
    };
    confirmEmail: {
      title: string;
      paramsNotFound: string;
    };
    common: {
      formDesc: string;
      showHelp: string;
      somethingWentWrong: string;
      maxFileSize: string;
      fieldMustBeNotEmpty: string;
      eliminateRemarks: string;
      save: string;
      edit: string;
      delete: string;
      cancel: string;
    };
    translate: {
      title: string;
      description: string;
      nativeLang: string;
      learnLang: string;
      allowRecomend: string;
      voiceNotFound: string;
      savePhrase: string;
      needLogin: string;
      savePhraseDesc: string;
      saveTranlsate: string;
      newTag: string;
      tagsTitle: string;
      tagHelp: string;
      addTags: string;
    };
    my: {
      title: string;
      deletePhrase: string;
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
