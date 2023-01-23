import { format } from 'date-fns';
import { IS_DEV, LOG_LEVEL } from './constants';

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
