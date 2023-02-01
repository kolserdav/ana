import storeAlert, { changeAlert } from '@/store/alert';
import { LogLevel } from '@/types/interfaces';
import { format } from 'date-fns';
import { IS_DEV, LOG_LEVEL, NO_SCROLL_CLASS } from '@/utils/constants';
import { Page } from '@prisma/client';
import { PageFull } from '@/types';
import React from 'react';

export const isDev = () => process.env.NODE_ENV === 'development';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (
  type: keyof typeof LogLevel,
  text: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  forUser = false
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

export const getDangerouslyCurrent = (elem: React.ReactElement): HTMLElement =>
  // @ts-ignore
  elem.ref?.current || null;
