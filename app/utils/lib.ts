import storeAlert, { changeAlert } from '@/store/alert';
import { LogLevel } from '@/types/interfaces';
import { format } from 'date-fns';
import { IS_DEV, LOAD_PAGE_DURATION, LOG_LEVEL, NO_SCROLL_CLASS } from '@/utils/constants';
import { Page } from '@prisma/client';
import { PageFull } from '@/types';

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
    console[type](IS_DEV ? format(new Date(), 'hh:mm:ss') : '', type, text, data);
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
  pages.forEach((item) => {
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
  current: HTMLElement;
  clientX: number;
  clientY: number;
}) => {
  const { x, y, height } = current.getBoundingClientRect();
  const bottom = y + height;
  return !(clientX < x || clientY < y || clientY > bottom);
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
