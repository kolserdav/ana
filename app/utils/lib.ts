import storeAlert, { changeAlert } from '@/store/alert';
import { LogLevel } from '@/types/interfaces';
import { format } from 'date-fns';
import { IS_DEV, LOG_LEVEL } from '@/utils/constants';
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
          type,
          children: text,
          open: true,
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
