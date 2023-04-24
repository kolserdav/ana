import { ThemeType } from '../Theme';
import { OrderBy } from '../types/interfaces';
import { log } from './lib';

// eslint-disable-next-line no-shadow
export enum LocalStorageName {
  // eslint-disable-next-line no-unused-vars
  THEME = 'THEME',
  // eslint-disable-next-line no-unused-vars
  ORDER_BY = 'ORDER_BY',
  // eslint-disable-next-line no-unused-vars
  FILTER_TAGS = 'FILTER_TAGS',
  // eslint-disable-next-line no-unused-vars
  STRONG_FILTER = 'STRONG_FILTER',
  // eslint-disable-next-line no-unused-vars
  LEARN_LANG = 'LEARN_LANG',
  // eslint-disable-next-line no-unused-vars
  NATIVE_LANG = 'NATIVE_LANG',
}

type LocalStorageValue<T extends keyof typeof LocalStorageName> = T extends LocalStorageName.THEME
  ? ThemeType
  : T extends LocalStorageName.ORDER_BY
  ? OrderBy
  : T extends LocalStorageName.FILTER_TAGS
  ? string[]
  : T extends LocalStorageName.STRONG_FILTER
  ? boolean
  : T extends LocalStorageName.LEARN_LANG
  ? string
  : T extends LocalStorageName.NATIVE_LANG
  ? string
  : never;

export function getLocalStorage<T extends keyof typeof LocalStorageName>(
  name: T
): LocalStorageValue<T> | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = null;
  if (typeof localStorage === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem(name);
  if (raw) {
    try {
      result = JSON.parse(raw);
    } catch (e) {
      log('error', 'Error parse local storage value', e);
    }
  }
  return result;
}

export function setLocalStorage<T extends keyof typeof LocalStorageName>(
  name: T,
  value: LocalStorageValue<T>
) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(name, JSON.stringify(value));
}
