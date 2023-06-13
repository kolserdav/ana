import { Prisma, User } from '@prisma/client';
import { format } from 'date-fns';
import fs from 'fs';
import { IncomingHttpHeaders } from 'http';
import path from 'path';

import {
  LANGUAGE_HEADER,
  LocaleValue,
  USER_ID_HEADER,
  Status,
  AUTHORIZATION_HEADER,
  TIMEOUT_HEADER,
  IMAGE_EXT,
  CSRF_HEADER,
  PAGE_CONFIRM_EMAIL,
  EMAIL_QS,
  KEY_QS,
  PAGE_RESTORE_PASSWORD_CALLBACK,
} from '../types/interfaces';
import { APP_URL, CLOUD_PATH, IS_DEV, LOG_LEVEL } from './constants';

// eslint-disable-next-line no-unused-vars
enum LogLevel {
  // eslint-disable-next-line no-unused-vars
  log = 0,
  // eslint-disable-next-line no-unused-vars
  info = 1,
  // eslint-disable-next-line no-unused-vars
  warn = 2,
  // eslint-disable-next-line no-unused-vars
  error = 3,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (type: keyof typeof LogLevel, text: string, _data?: any, cons?: boolean) => {
  const date = IS_DEV ? format(new Date(), 'hh:mm:ss') : '';
  if (cons) {
    // eslint-disable-next-line no-console
    console[type](IS_DEV ? date : '', type, text, _data);
  } else if (LogLevel[type] >= LOG_LEVEL || Number.isNaN(LOG_LEVEL)) {
    // eslint-disable-next-line no-console
    console[type](IS_DEV ? date : '', type, text, _data, '\n');
  }
};

export const wait = async (time: number) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, time);
  });
};

export const checkCors = (headers: IncomingHttpHeaders) => {
  const { origin } = headers;
  if (APP_URL !== origin) {
    log('warn', 'Block CORS attempt', { headers, APP_URL });
    return false;
  }
  return true;
};

export const parseHeaders = (headers: IncomingHttpHeaders) => {
  const {
    [LANGUAGE_HEADER]: lang,
    [USER_ID_HEADER]: uuid,
    [AUTHORIZATION_HEADER]: authorization,
    [TIMEOUT_HEADER]: timeout,
    [CSRF_HEADER]: csrf,
  } = headers;
  return {
    lang: lang as LocaleValue,
    id: uuid as string,
    token: authorization as string,
    timeout: timeout as string,
    csrf: csrf as string,
  };
};

export const getPseudoHeaders = ({ lang }: { lang: LocaleValue }) => {
  const headers: Record<string, string> = {};
  headers[LANGUAGE_HEADER] = lang;
  return headers;
};

export const checkIsMany = (command: Prisma.PrismaAction) =>
  /[a-zA-Z]+Many$/.test(command) ? [] : null;

export const checkIsFind = (command: Prisma.PrismaAction) => /^find/.test(command);

export const getHttpCode = (status: Status) => {
  return status === 'warn' ? 404 : 500;
};

export const createDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

export const changeImgExt = ({
  name,
  ext,
  postfix = '',
}: {
  name: string;
  ext: string;
  postfix?: string;
}) => name.replace(new RegExp(`${ext}$`), `${postfix}${IMAGE_EXT}`);

export const getFilePath = ({
  userCloud,
  id,
  ext,
  postfix = '',
}: {
  userCloud: string;
  id: string;
  ext: string;
  postfix?: string;
}) => path.resolve(userCloud, `${id}${postfix}${ext}`);

export const getCloudPath = (id: string) => path.resolve(CLOUD_PATH, id);

const cleanLastSlush = (text: string) => text.replace(/\/$/, '');

export const getConfirmEmailLink = ({
  user,
  lang,
}: {
  user: User & { ConfirmLink: { id: string }[] };
  lang: LocaleValue;
}) =>
  `${cleanLastSlush(APP_URL)}/${lang}/${PAGE_CONFIRM_EMAIL}?${EMAIL_QS}=${user.email}&${KEY_QS}=${
    user.ConfirmLink[0]!.id
  }`;

export const getForgotPasswordLink = ({
  restoreId,
  lang,
  email,
}: {
  restoreId: string;
  lang: LocaleValue;
  email: string;
}) =>
  `${cleanLastSlush(
    APP_URL
  )}/${lang}/${PAGE_RESTORE_PASSWORD_CALLBACK}?${EMAIL_QS}=${email}&${KEY_QS}=${restoreId}`;
