import { format } from 'date-fns';
import { ThemeType } from '../Theme';
import { LocaleValue, OrderBy, DateFilter } from '../types/interfaces';

export const LOCALE_NAMES: Record<LocaleValue, string> = {
  en: 'English',
  ru: 'Русский',
};

export const URL_PLACEHOLDER = 'https://example.com';
export const DATE_FILTER_ALL: DateFilter = 'all-time';
export const DATE_FILTER_STATISTICS_DEFAULT: DateFilter = 'week';
export const LOG_LEVEL = parseInt(process.env.NEXT_PUBLIC_LOG_LEVEL as string, 10);
export const SERVER_LOCAL_ADDRESS = process.env.SERVER_LOCAL_ADDRESS as string;
export const SERVER = process.env.NEXT_PUBLIC_SERVER as string;
export const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN as string;
export const REPOSITORY_LINK = process.env.NEXT_PUBLIC_REPOSITORY_LINK as string;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const ERUDA = (process.env.NEXT_PUBLIC_ERUDA as string) === 'true';
export const TINY_API_KEY = process.env.NEXT_PUBLIC_TINY_KEY as string;
export const WS_ADDRESS = process.env.NEXT_PUBLIC_WS_ADDRESS as string;
// eslint-disable-next-line no-shadow
export enum Pages {
  // eslint-disable-next-line no-unused-vars
  signIn = '/account/sign-in',
  // eslint-disable-next-line no-unused-vars
  signUp = '/account/sign-up',
  // eslint-disable-next-line no-unused-vars
  restorePassword = '/account/restore-password',
  // eslint-disable-next-line no-unused-vars
  translate = '/',
  // eslint-disable-next-line no-unused-vars
  about = '/about',
  // eslint-disable-next-line no-unused-vars
  donate = '/about/donate',
  // eslint-disable-next-line no-unused-vars
  policy = '/policy',
  // eslint-disable-next-line no-unused-vars
  aboutTranslate = '/about/translate',
  // eslint-disable-next-line no-unused-vars
  rules = '/rules',
  // eslint-disable-next-line no-unused-vars
  contacts = '/contacts',
  // eslint-disable-next-line no-unused-vars
  settings = '/settings',
  // eslint-disable-next-line no-unused-vars
  statistics = '/my/statistics',
  // eslint-disable-next-line no-unused-vars
  trash = '/my/trash',
  // eslint-disable-next-line no-unused-vars
  myDictionary = '/my/texts',
  // eslint-disable-next-line no-unused-vars
  admin = '/admin/area',
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
// Deps load-page-duration
export const LOAD_PAGE_DURATION = 900;
export const LABEL_TRANSITION = '0.2s';
export const PROJECT_TITLE_MAX = 255;
export const IMAGE_PREVIEW_WIDTH = 140;
export const TEXTAREA_ROWS_DEFAULT = 10;
export const TEXTAREA_MAX_ROWS = 30;
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
export const ORDER_BY_DEFAULT: OrderBy = 'asc';
export const TAKE_PHRASES_DEFAULT = 20;
// deps packages/translate2/utils/constants.py LEARN_LANG_DEFAULT
export const LEARN_LANG_DEFAULT = 'en';
// deps packages/translate2/utils/constants.py NATIVE_LANG_DEFAULT
export const NATIVE_LANG_DEFAULT = 'ru';
// deps android/app/src/main/AndroidManifest.xml android:scheme
export const ANDROID_APP_SCHEME = 'com.kolserdav.ana';
export const LICENSE = {
  title: 'AGPL-3.0 license ',
  link: 'https://www.gnu.org/licenses/agpl-3.0.html',
};
export const FDROID_LINK = 'https://f-droid.org/en/packages/com.kolserdav.ana/';
// deps packages/server/orm/schema.prisma.Phrase.text
export const PHRASE_MAX_LENGTH_DEFAULT = 1000;
export const TRANSLATE_MAX_SYMBOLS = 10000;
export const SPEECH_TEST_TEXT_DEFAULT = 'Test';
export const SPEECH_SPEED_DEFAULT = 1;
export const SPEECH_SPEED_MAX = 1.5;
// deps $app-bar-transition
export const APP_BAR_TRANSITION = 0.4;
// deps $app-bar-height
export const APP_BAR_HEIGHT = 60;
// deps $spoiler-border-width
export const SPOILER_BORDER_WIDTH = 1;
// deps $input-margin-bottom
export const INPUT_MARGIN_BOTTOM = 30;
// deps $form-item-margin-top
export const FORM_ITEM_MARGIN_TOP = 25;
// deps $input-height
export const INPUT_HEIGHT = 50;
export const DATA_TYPE_PLAY_BUTTON = 'play_button';
export const DATA_TYPE_PHRASE = 'phrase';
export const PLAY_ALL_ITEM_PAUSE = 1000;
// deps $fixed-tools-hight
export const FIXED_TOOLS_HIGHT = 44;
export const PLAY_ALL_SCROLL_BY_TOP_SHIFT = 20;
// deps $text-area-activities-coeff
export const SCALE_ICONS_COEFF = 1.5;
export const WARN_ALERT_TIMEOUT = 500;
export const TICKER_DURATION_COEFFICIENT = 0.08;
export const SUPPORT_TEXT_MAX_LENGHT = 2500;
export const SUPPORT_SUBJECT_MAX_LENGTH = 100;
export const TOOLTIP_DURATION = 2000;
export const GRAPH_XAXIS_DATA_KEY = 'name';
// deps $translate-container-max
export const GRAPH_WIDTH_DEFAULT = 760;
export const GRAPH_HEIGHT_COEFF = 1.6666666666666667;
// deps $container-padding
export const CONTAINER_PADDING = 16;
// deps in parseProcessText in android/app/src/main/java/com/kolserdav/ana/Config.java.QUERY_STRING_PROCESS_TEXT
export const PROCESS_TEXT_QUERY_STRING = 'process_text';
export const TAKE_ALL = 100000000;
export const LINK_REPLACED = '...http...';

export const NULL_STR = 'null';
// deps android/app/src/main/AndroidManifest.xml android:host
export const DEEP_LINK_HOST = 'path';
export const PUSH_NOTIFICATIONS_TAKE = 10;

// deps packages/server/orm/schema.prisma PushNotification.title
export const PUSH_NOTIFICATION_TITLE_MAX_LENGTH = 48;

// deps packages/server/orm/schema.prisma PushNotification.description
export const PUSH_NOTIFICATION_DESCRIPTION_MAX_LENGTH = 255;

export const PUSH_NOTIFICATION_DESCRIPTION_MIN_LENGTH = 50;
export const PUSH_NOTIFICATION_LANG_DEFAULT: keyof typeof LOCALE_NAMES = 'en';
export const PUSH_NOTIFICATION_PATH_DEFAULT = Pages.translate;

// Dependency
export const ANDROID_NOT_STOP_WEB_DEFAULT = true;
