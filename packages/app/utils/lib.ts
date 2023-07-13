import { format, formatDistance } from 'date-fns';
import { ru, enUS as en } from 'date-fns/locale';
import { Page } from '@prisma/client';
import storeAlert, { changeAlert } from '../store/alert';
import { LocaleValue, LogLevel } from '../types/interfaces';
import { LOAD_PAGE_DURATION, LOG_LEVEL, NO_SCROLL_CLASS } from './constants';
import { PageFull } from '../types';

export const DATE_LOCALE = {
  ru,
  en,
};

export const isDev = () => process.env.NODE_ENV === 'development';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (
  type: keyof typeof LogLevel,
  text: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  forUser = false,
  infinity = false
) => {
  if (LogLevel[type] >= LOG_LEVEL) {
    // eslint-disable-next-line no-console
    console[type](format(new Date(), 'hh:mm:ss'), type, text, data);
  }
  if (forUser) {
    storeAlert.dispatch(
      changeAlert({
        alert: {
          status: type,
          message: text,
          infinity,
        },
      })
    );
  }
};

export const isTest = () => /http:\/\/192\.168\.0\.\d{1,3}/.test(window?.location.origin);

export const prepagePage = (pages: Page[]) => {
  const page: Record<string, string> = {};
  pages?.forEach((item) => {
    page[item.field] = item.value;
  });
  return page as PageFull;
};

export const setBodyScroll = (scroll: boolean) => {
  if (scroll) {
    document.body.classList.remove(NO_SCROLL_CLASS);
  } else {
    document.body.classList.add(NO_SCROLL_CLASS);
  }
};

export const checkClickBy = ({
  current,
  clientX,
  clientY,
}: {
  current: Element;
  clientX: number;
  clientY: number;
}) => {
  const { x, y, height, width } = current.getBoundingClientRect();
  const bottom = y + height + 1;
  const right = x + width + 1;
  return !(clientX < x || clientY < y || clientY > bottom || clientX > right);
};

export const getKey = ({ index, name }: { index: number; name: string }) => `${name}-${index}`;

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const waitForTimeout = async (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, timeout);
  });

export const getChangeDate = (timeout: number) => new Date().getTime() - timeout;

export const awaitResponse = async (timeout: number) => {
  const diffs = LOAD_PAGE_DURATION - getChangeDate(timeout);
  if (diffs > 0) {
    await waitForTimeout(diffs);
  }
};

export const checkRouterPath = (asPath: string, checkValue: string | string[]) => {
  const checkOne = (_checkValue: string) => {
    const checkReg = new RegExp(`^${_checkValue}(\\?=?[a-zA-Z%-_0-9]*)?$`);
    return checkReg.test(asPath);
  };

  if (typeof checkValue === 'string') {
    return checkOne(checkValue);
  }
  let checkMany = false;
  checkValue.forEach((item) => {
    if (!checkMany) {
      checkMany = checkOne(item);
    }
  });
  return checkMany;
};

export const getWindowDimensions = () => {
  const res = {
    width: 0,
    height: 0,
  };
  if (typeof window !== 'undefined') {
    const { innerWidth, innerHeight } = window;
    res.width = innerWidth;
    res.height = innerHeight;
  }

  return res;
};

export const cleanPath = (asPath: string) => asPath.replace(/(\?|#).*$/, '');

export function getUTCDate(date: Date): Date {
  const dt = new Date(date);
  dt.setTime(dt.getTime() + dt.getTimezoneOffset() * 60 * 1000);
  return dt;
}

export const getFormatDistance = (dateFrom: Date, locale: LocaleValue) =>
  formatDistance(new Date(dateFrom), new Date(), {
    addSuffix: true,
    locale: DATE_LOCALE[locale],
  });

export async function copyToClipboard(textToCopy: string, message: string) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textToCopy);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      log('error', 'Error copy to clipboard', error);
    } finally {
      textArea.remove();
    }
  }
  log('info', message, {}, true);
}

export const getDocLocale = (locale: string | undefined) => (locale === 'ru' ? locale : 'en');

export const shortenString = (str: string, len: number) => {
  let res = '';
  for (let i = 0; str[i] && i <= len - 1; i++) {
    res += str[i];
  }
  return res;
};

export const copyText = (text: string) => {
  if (typeof androidCommon === 'undefined') {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve) => {
    androidCommon.copyToClipboard(text);
    resolve(0);
  });
};

export const wait = async (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, timeout);
  });
