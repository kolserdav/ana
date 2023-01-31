import { Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { IncomingHttpHeaders } from 'http';
import ru from '../locales/ru/lang';
import {
  Locale,
  DEFAULT_LOCALE,
  LANGUAGE_HEADER,
  LocaleValue,
  USER_ID_HEADER,
  Status,
} from '../types/interfaces';
import { APP_URL, IS_DEV, LOG_LEVEL } from './constants';

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

const locales: Record<string, Locale> = {
  ru,
};

export const getLocale = (_value: string | undefined): Locale => {
  const value = _value || DEFAULT_LOCALE;
  return (!locales[value] ? locales[DEFAULT_LOCALE] : locales[value]) as Locale;
};

export const parseHeaders = (headers: IncomingHttpHeaders) => {
  const { [LANGUAGE_HEADER]: lang, [USER_ID_HEADER]: uuid } = headers;
  return { lang: lang as LocaleValue, id: uuid as string };
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
