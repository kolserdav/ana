/* eslint-disable no-unused-vars */
import { PageField } from '@prisma/client';
import { Theme } from '../Theme';
import { Locale, Result, Status, UserCleanResult } from './interfaces';

export type VolumeIcon = 'high' | 'medium' | 'low';

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
  className?: string;
  withoutScale?: boolean;
}

export interface AlertProps {
  status: Status;
  message: string;
  infinity: boolean;
}

export interface QueryString {
  /**
   * Redirect
   */
  r?: string;
}

export interface AppProps {
  app: {
    theme: Theme;
    user: UserCleanResult | null;
    userLoad: boolean;
    touchpad: boolean;
    connId: string | null;
    _url: string | null;
    urlDefault: string;
    isAndroid: boolean;
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
  error?: string;
}

export interface ServerLanguage {
  code: string;
  name: string;
}

export interface DocumentProps extends AppProps {
  page: PageFull;
  localeAppBar: Locale['app']['appBar'];
}
