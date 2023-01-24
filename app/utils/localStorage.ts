import { ThemeType } from '../types';
import { log } from './lib';

// eslint-disable-next-line no-shadow
export enum LocalStorageName {
  // eslint-disable-next-line no-unused-vars
  THEME = 'THEME',
}

type LocalStorageValue<T extends keyof typeof LocalStorageName> = T extends LocalStorageName.THEME
  ? ThemeType
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
