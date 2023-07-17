/* eslint-disable no-unused-vars */

import {
  Phrase,
  PhraseTag,
  Prisma,
  PrismaClient,
  Tag,
  User,
  Selector,
  SelectorNames,
} from '@prisma/client';

export const TRANSLATE_PREFIX = '/libre';

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
  putPhrase = '/v1/phrase',
  getPhrase = '/v1/phrase-find-first',
  postPhraseCreate = '/v1/phrase-create',
  getTagsFindMany = '/v1/tags-find-many',
  deleteTag = '/v1/tag',
  putTag = '/v1/tag',
  getPhraseFindMany = '/v1/phrase-find-many',
  postTagCreate = '/v1/tag-create',
  postForgotPassword = '/v1/forgot-password',
  postUserLogin = '/v1/user-login',
  getCheckEmail = '/v1/check-email',
  getLanguages = '/v1/languages',
  translate = '/libre/translate',
  languages = '/libre/languages',
  putUserUpdate = '/v1/user-update',
  deleteUserDelete = '/v1/user-delete',
  getPhraseFindByText = '/v1/phrase-find-by-text',
  getPhraseDistinct = '/v1/phrase-distinct',
  deletePhraseDeleteMany = '/v1/phrase-delete-many',
  putPhraseUpdateMany = '/v1/phrase-update-many',
  postSendConfirmEmail = '/v1/send-confirm-email',
  postSupport = '/v1/support',
  getStatistics = '/v1/get-statistics',
  localPostSelector = '/local/create-selector',
}

// eslint-disable-next-line no-shadow
export enum LogLevel {
  info = 0,
  warn = 1,
  error = 2,
}

// eslint-disable-next-line no-shadow
export enum LocaleVars {
  show = '%show',
  all = '%all',
  count = '%count',
}

// Deps android/app/src/main/java/com/kolserdav/ana/Config.java
export const CHECK_URL_PATH = '/api/check';
export const MINIMAL_SUPPORT_TEXT_LENGTH = 10;
export const UNDEFINED_QUERY_STRING = 'undefined';
export const QUERY_STRING_ARRAY_SPLITTER = ',';
export const QUERY_STRING_PLUS_SYMBOL = '::plus::';
export const QUERY_STRING_MINUS_SYMBOL = '::minus::';
export type LocaleValue = 'ru' | 'en';
export const WS_MESSAGE_COMMENT_SERVER_RELOAD = 'server_reload';
export const TRANSLATE_SERVICE_UNAVAILABLE_COMMENT = 'translate_unavailable';

/**
 * WS messages
 */
export const WS_MESSAGE_CONN_ID = 'conn_id';
export const WS_MESSAGE_LOCALE = 'locale';
export const WS_MESSAGE_USER_ID = 'user_id';

export const PAGE_RESTORE_PASSWORD_CALLBACK = '/account/restore-callback';
export const PAGE_CONFIRM_EMAIL = '/account/confirm-email';
export const EMAIL_QS = 'e';
export const KEY_QS = 'k';
export const CLOUD_PREFIX = '/cloud';
export const IMAGE_EXT = '.avif';
export const IMAGE_PREV_POSTFIX = '-preview';
export type WSProtocol = 'test' | 'login' | 'confirm-email' | 'app';
export const LOCALE_DEFAULT: LocaleValue = 'en';
export const LANGUAGE_HEADER = 'lang';
export const USER_ID_HEADER = 'uuid';
export const CSRF_HEADER = 'X-CSRF-Token';
export const AUTHORIZATION_HEADER = 'authorization';
export const TIMEOUT_HEADER = 'timeout';
export const APPLICATION_JSON = 'application/json';
export const PREVIEW_IMAGE_WIDTH = 320;
export const IMAGE_EXTS = '.avif, .jpg, .jpeg, .gif, .png, .webp';
export const MAX_BODY_MB = 5;
/**
 * This required to be 4
 */
export const SEARCH_MIN_LENGTH = 4;

export interface ProcessMessage<T> {
  id: string;
  msg: T;
}

export interface RequestContext {
  lang: LocaleValue;
  timeout: number;
}

export interface GroupBySummaryDateItemCount {
  summary_date: string;
  updated: number;
  created: number;
  deleted: number;
  count: number;
}
export type GroupBySummaryDateItemCountRaw = Omit<
  GroupBySummaryDateItemCount,
  'updated' | 'created' | 'deleted'
>;

export interface GroupBySummaryDateItemSum {
  summary_date: string;
  sum: number;
}

export type DateTruncateArgument = 'year' | 'month' | 'week' | 'day' | 'hour';

export type DateFilter =
  | 'day'
  | 'week'
  | 'month'
  | 'three-months'
  | 'six-months'
  | 'year'
  | 'all-time';

export type Status = 'error' | 'warn' | 'info';
export interface WSMessage {
  type: Status;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: string;
  token?: string;
  forUser?: boolean;
  infinity?: boolean;
}
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

export type OrderBy = 'desc' | 'asc';
export type Bool = '1' | '0';
export type FullUserName = { name: string; surname: string };
export type FullTag = Tag & { PhraseTag: { phraseId: string }[] };
export type PhraseFull = Phrase & { PhraseTag: (PhraseTag & { Tag: FullTag })[] };

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

export interface SendConfirmEmailBody {
  userId: string;
  email: string;
}
export type SendConfirmEmailResult = UserCleanResult;

export interface SupportBody {
  userId: string;
  subject: string;
  text: string;
  date: string;
}
export type SupportResult = UserCleanResult;

export interface UserUpdateBody {
  userId: string;
  email?: string;
  password?: {
    oldPassword: string;
    newPassword: string;
  };
  notificationId?: string;
  name?: string;
  pushEnabled?: boolean;
  timeZone?: number;
}

export interface UserDeleteBody {
  userId: string;
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
  learnLang: string;
  nativeLang: string;
  translate: string;
  reTranslate: string;
  deleted?: boolean;
}
export type PhraseCreateResult = Phrase | null;

export interface PhraseDeleteBody {
  phraseId: string;
}
export type PhraseDeleteResult = Phrase | null;

export interface PhraseDeleteManyBody {
  phrases: string[];
}
export type PhraseDeleteManyResult = Phrase[];

export interface PhraseUpdateManyBody {
  phrases: string[];
  data: {
    deleted?: boolean;
  };
}
export type PhraseUpdateManyResult = Phrase[];

export interface PhraseUpdateBody {
  phraseId: string;
  data: Partial<PhraseCreateBody>;
}
export type PhraseUpdateResult = PhraseFull | null;

export interface TagCreateBody {
  text: string;
}
export type TagCreateResult = Tag | null;

export interface TagUpdateBody {
  tagId: string;
  data: Partial<TagCreateBody>;
}
export type TagUpdateResult = Tag | null;

export interface TagDeleteBody {
  tagId: string;
}
export type TagDeleteResult = Tag | null;

export type TagFindManyQuery = {
  deleted?: Bool;
  gt: string;
};
export type TagFindManyResult = FullTag[];

export type SelectorCreateBody = {
  type: SelectorNames;
  value: string;
};
export type SelectorCreateResult = Selector | null;

export interface PhraseFindFirstQuery {
  phraseId: string;
}
export type PhraseFindFirstResult = PhraseFull | null;

export interface PhraseDistinctQuery {
  distinct: Prisma.Enumerable<Prisma.PhraseScalarFieldEnum>;
  isTrash: Bool;
}
export type PhraseDistinctResult = string[];

export interface PhraseFindByTextQuery {
  text: string;
}
export type PhraseFindByTextResult = { id: string } | null;

export interface PhraseFindManyQuery {
  orderBy: OrderBy;
  skip: string;
  take: string;
  tags: string;
  strongTags: Bool;
  search: string;
  gt: string;
  isTrash: Bool;
  learnLang: string;
  light: Bool;
}
export type PhraseFindManyResult = PhraseFull[];
export type PhraseFindManyResultLight = string[];

export interface GetStatisticsQuery {
  userId: string;
  gt: string;
  dateFilter: DateFilter;
  timeZone: string;
}
export type GetStatisticsResult = {
  phrasesCount: number;
  user: UserCleanResult;
  groupPhrases: {
    items: GroupBySummaryDateItemCount[];
  };
  groupOnline: {
    items: GroupBySummaryDateItemSum[];
  };
  truncArg: DateTruncateArgument;
};

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
    phraseLoad: string;
    tagDeleted: string;
    tagUpdated: string;
    serverReload: string;
    mailSubjects: {
      confirmEmail: string;
      resetPassword: string;
      deletedAccount: string;
    };
    translateServiceNotWorking: string;
    supportSuccess: string;
  };
  app: {
    login: {
      email: string;
      name: string;
      register: string;
      loginButton: string;
      signUp: string;
      signIn: string;
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
      restoreDesc: string;
      changePassword: string;
      newPassword: string;
      save: string;
      wrongParameters: string;
      sendNewLetter: string;
      acceptPolicyAndRules: string;
      subtitle: string;
    };
    appBar: {
      darkTheme: string;
      homePage: string;
      login: string;
      logout: string;
      translate: string;
      myDictionary: string;
      openMenu: string;
      statistics: string;
      closeMenu: string;
      changeInterfaceLang: string;
      about: string;
      closeApp: string;
      settings: string;
      logoutDesc: string;
      yes: string;
      no: string;
      cancel: string;
      send: string;
      support: {
        title: string;
        description: string;
        warning: string;
        subject: string;
        text: string;
        subjectMustBeNotEmpty: string;
        minimalLengthOfTextIs: string;
      };
      trash: string;
    };
    confirmEmail: {
      title: string;
      goBack: string;
      paramsNotFound: string;
    };
    common: {
      formDesc: string;
      showHelp: string;
      somethingWentWrong: string;
      fieldMustBeNotEmpty: string;
      eliminateRemarks: string;
      save: string;
      edit: string;
      delete: string;
      cancel: string;
      policyTitle: string;
      rulesTitle: string;
      and: string;
      voiceNotFound: string;
      playSound: string;
      sendMail: string;
      emailIsSend: string;
      openTools: string;
      copyText: {
        title: string;
        textCopied: string;
        copyTextError: string;
      };
      dateFilter: {
        forDay: string;
        forWeek: string;
        forMonth: string;
        forThreeMoths: string;
        forSixMonths: string;
        forYear: string;
        forAllTime: string;
      };
      sort: {
        byAlpha: string;
        byNumeric: string;
      };
      wrongUrlFormat: string;
      openInApp: string;
      needUpdateApp: string;
    };
    translate: {
      title: string;
      description: string;
      descEdit: string;
      nativeLang: string;
      learnLang: string;
      allowRecomend: string;
      savePhrase: string;
      needLogin: string;
      savePhraseDesc: string;
      saveTranlsate: string;
      newTag: string;
      tagsTitle: string;
      tagHelp: string;
      addTags: string;
      updatePhrase: string;
      createPhrase: string;
      deleteTag: string;
      deleteTagDesc: string;
      updateTag: string;
      changeTag: string;
      textareaPlaceholder: string;
      copied: string;
      swapLangs: string;
      cleanField: string;
      quitEdit: string;
      startRecognize: string;
      errorSpeechRecog: string;
      recognizeNotSupport: string;
      microNotPermitted: string;
      serverIsNotConnected: string;
      undo: string;
      closeUpdateTag: string;
    };
    my: {
      title: string;
      deletePhrase: string;
      updatePhrase: string;
      byUpdateDate: string;
      filterByTags: string;
      strongAccord: string;
      emptyPhrases: string;
      /**
       * @description
       * Required to change LocaleVars.show and LocaleVars.all
       */
      pagination: string;
      minimalSearchLenght: string;
      allLangs: string;
      selectAll: string;
      unselectAll: string;
      deleteSelected: string;
      moveSelectedToTrash: string;
      /**
       * @description
       * Required to change LocaleVars.count
       */
      willDelete: string;
      resetAllFilters: string;
      playAll: string;
      openTools: string;
      selectPhrase: string;
      translation: string;
      reTranslation: string;
      trash: string;
      moveToTrash: string;
      deleteImmediatly: string;
      cleanTrash: string;
      cleanTrashDesc: string;
    };
    app: {
      connectionRefused: string;
      connectionReOpened: string;
      acceptCookies: string;
      ok: string;
      withPolicy: string;
    };
    about: {
      aboutProgram: string;
      licenseTitle: string;
      repoTitle: string;
      aboutSite: string;
      contactsTitle: string;
      donate: string;
      packageVersion: string;
      download: string;
    };
    settings: {
      title: string;
      speechSettings: string;
      speechSpeed: string;
      speechTest: string;
      speechLang: string;
      speechVoice: string;
      personalData: string;
      deleteAccountTitle: string;
      deleteAccountDesc: string;
      deleteAccountSecure: string;
      deleteVerifying: string;
      deleteMyAccount: string;
      deleteAccountWarning: string;
      changePassword: string;
      emailIsConfirmed: string;
      sendConfirmEmail: string;
      selectNode: string;
      defaultNode: string;
      customNode: string;
      serverIsNotRespond: string;
      saveVoiceTestText: string;
      saveAllTestText: string;
      successCheckNode: string;
      notifications: {
        title: string;
        description: string;
      };
    };
    statistics: {
      title: string;
      description: string;
      newTexts: string;
      updatedTexts: string;
      trashedText: string;
      studyTime: string;
      dateDuration: {
        days: string;
        months: string;
        years: string;
        hours: string;
        minutes: string;
        seconds: string;
      };
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

export const firstCapitalize = (word: string) => {
  let res = '';
  const { length } = word;
  for (let i = 0; i < length; i++) {
    const letter = word[i];
    if (letter) {
      res += i === 0 ? letter.toUpperCase() : word[i];
    }
  }
  return res;
};

export const parseMessage = (message: string): WSMessage | null => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = JSON.parse(message);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('error', 'parseMessage', err);
    return null;
  }
  return data;
};
