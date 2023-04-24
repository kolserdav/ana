import { LOCALE_DEFAULT, Locale } from '../types/interfaces';
import ru from '../locales/ru/lang';
import en from '../locales/en/lang';

const locales: Record<string, Locale> = {
  ru,
  en,
};

const getLocale = (_value: string | undefined): Locale => {
  const value = _value || LOCALE_DEFAULT;
  return (!locales[value] ? locales[LOCALE_DEFAULT] : locales[value]) as Locale;
};

export default getLocale;
