/* eslint-disable no-unused-vars */
import { PageField } from '@prisma/client';
import { Theme } from '../Theme';
import { Locale, Result, Status, UserCleanResult } from './interfaces';

export type PageFull = {
  // eslint-disable-next-line no-unused-vars
  [K in PageField]: string;
};

export interface IconProps {
  width?: number;
  height?: number;
  children: string;
  color?: string;
  animate?: React.ReactNode;
}

export interface AlertProps {
  status: Status;
  message: string;
  infinity: boolean;
}

export interface AppProps {
  app: {
    theme: Theme;
    user: UserCleanResult;
    userLoad: boolean;
    touchpad: boolean;
  };
}

export interface LoginProps extends AppProps {
  localeLogin: Locale['app']['login'];
  localeAppBar: Locale['app']['appBar'];
  localeCommon: Locale['app']['common'];
  page: PageFull;
}

export type HTMLEditorOnChange = (e: string) => void;

export interface TranslateResult extends Result<null> {
  translatedText?: string;
}

export interface ServerLanguage {
  code: string;
  name: string;
  targets: string[];
}
