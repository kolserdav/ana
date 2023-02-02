import { ThemeType } from '@/types';

export const SERVER = process.env.NEXT_PUBLIC_SERVER as string;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const LOG_LEVEL = parseInt(process.env.NEXT_PUBLIC_LOG_LEVEL as string, 10);
export const WS_ADDRESS = process.env.NEXT_PUBLIC_WS_ADDRESS as string;

export const ALERT_DURATION = 3000;
export const ALERT_COUNT_MAX: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = 2;
export const EMAIL_MAX_LENGTH = 255;
export const NAME_MAX_LENGTH = 24;
export const SURNAME_MAX_LENGTH = 35;
export const DEFAULT_THEME: ThemeType = 'dark';
export const TAB_INDEX_DEFAULT = -1;
export const PASSWORD_MIN_LENGTH = 6;
export const LOAD_PAGE_TIMEOUT = 1800;
export const LABEL_TRANSITION = '0.2s';
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
// Deps $alert-transition
export const ALERT_TRANSITION = 400;
// Deps $alert-transition-y
export const ALERT_TRANSITION_Y = 100;
