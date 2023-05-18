import { format } from 'date-fns';
import { ThemeType } from '../Theme';
import { LocaleValue, OrderBy } from '../types/interfaces';

export const LOCALE_NAMES: Record<LocaleValue, string> = {
  en: 'English',
  ru: 'Русский',
};
export const SERVER = process.env.NEXT_PUBLIC_SERVER as string;
export const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN as string;
export const REPOSITORY_LINK = process.env.NEXT_PUBLIC_REPOSITORY_LINK as string;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const LOG_LEVEL = parseInt(process.env.NEXT_PUBLIC_LOG_LEVEL as string, 10);
export const ERUDA = (process.env.NEXT_PUBLIC_ERUDA as string) === 'true';
export const TINY_API_KEY = process.env.NEXT_PUBLIC_TINY_KEY as string;
export const WS_ADDRESS = process.env.NEXT_PUBLIC_WS_ADDRESS as string;
// eslint-disable-next-line no-shadow
export enum Pages {
  // eslint-disable-next-line no-unused-vars
  home = '/',
  // eslint-disable-next-line no-unused-vars
  signIn = '/account/sign-in',
  // eslint-disable-next-line no-unused-vars
  signUp = '/account/sign-up',
  // eslint-disable-next-line no-unused-vars
  restorePassword = '/account/restore-password',
  // eslint-disable-next-line no-unused-vars
  translate = '/',
  // eslint-disable-next-line no-unused-vars
  myDictionary = '/my',
  // eslint-disable-next-line no-unused-vars
  about = '/about',
  // eslint-disable-next-line no-unused-vars
  policy = '/policy',
  // eslint-disable-next-line no-unused-vars
  rules = '/rules',
  // eslint-disable-next-line no-unused-vars
  contacts = '/contacts',
}

const now = new Date();
const dateFormat = 'yyyy-MM-dd';
export const DATE_NOW = format(now, dateFormat);
now.setDate(now.getDate() + 1);
export const MIN_DATE_ACTUAL = format(now, dateFormat);
now.setFullYear(now.getFullYear() + 1);
export const MAX_DATE_ACTUAL = format(now, dateFormat);
export const PAGE_LOGIN_IN_MENU = Pages.signIn;
export const ALERT_DURATION = 3000;
export const ALERT_COUNT_MAX: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = 3;
// Deps $alert-transition
export const ALERT_TRANSITION = 300;
// Deps $alert-transition-y
export const ALERT_TRANSITION_Y = 100;
export const EMAIL_MAX_LENGTH = 255;
export const NAME_MAX_LENGTH = 24;
export const SURNAME_MAX_LENGTH = 35;
export const DEFAULT_THEME: ThemeType = 'dark';
export const TAB_INDEX_DEFAULT = -1;
export const PASSWORD_MIN_LENGTH = 6;
export const PUBLIC_ICONS_FILES = '/icons/files/';
export const SELECTED_TAG_MAX = 2;
export const LINK_REGEX =
  /(https?:\/\/)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
export const LINK_REGEX_HTTP =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

// Deps load-page-duration
export const LOAD_PAGE_DURATION = 900;
export const LABEL_TRANSITION = '0.2s';
export const PROJECT_TITLE_MAX = 255;
export const IMAGE_PREVIEW_WIDTH = 140;
export const TEXTAREA_ROWS_DEFAULT = 3;
export const TEXTAREA_MAX_ROWS = 8;
export const FONT_SUBSETS: (
  | 'cyrillic'
  | 'latin'
  | 'cyrillic-ext'
  | 'greek'
  | 'greek-ext'
  | 'latin-ext'
)[] = ['cyrillic', 'latin'];
// Deps $icon-width-default
export const ICON_WIDTH_DEFAULT = 24;
export const EXPAND_LESS_SHOW_FROM = -300;
// Deps $menu-transition
export const MENU_TRANSITION = 300;
// Deps global
export const NO_SCROLL_CLASS = 'no__scroll';
// Deps $html-editor-height
export const HTML_EDITOR_HEIGHT = 300;
// Deps $mobile-width
export const MOBILE_WIDTH = 760;

export const TRANSLATE_DELAY = 1000;
export const TEXTAREA_ROWS = 4;
export const ORDER_BY_DEFAULT: OrderBy = 'asc';
export const TAKE_PHRASES_DEFAULT = 10;
export const LEARN_LANG_DEFAULT = 'en';
export const NATIVE_LANG_DEFAULT = 'ru';
export const LICENSE = {
  title: 'AGPL-3.0 license ',
  link: 'https://www.gnu.org/licenses/agpl-3.0.html',
};
export const FOCUS_TEXTAREA_TIMEOUT = 500;
// deps packages/server/orm/schema.prisma.Phrase.text
export const PHRASE_MAX_LENGTH = 1000;
