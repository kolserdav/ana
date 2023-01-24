import storeAlert, { changeAlert } from '@/store/alert';
import { LogLevel } from '@/types/interfaces';
import { format } from 'date-fns';
import { IS_DEV, LOG_LEVEL } from './constants';

export const isDev = () => process.env.NODE_ENV === 'development';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (
  type: keyof typeof LogLevel,
  text: string,
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
