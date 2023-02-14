/* eslint-disable no-unused-vars */
import { PageField } from '@prisma/client';
import { Theme } from '../Theme';
import { Locale, MessageType, SendMessageArgs, Status } from './interfaces';

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
    user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'];
    userLoad: boolean;
  };
}

export interface LoginProps extends AppProps {
  localeLogin: Locale['app']['login'];
  localeAppBar: Locale['app']['appBar'];
  page: PageFull;
}

export type HTMLEditorOnChange = (e: {
  readonly type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly target: any;
  readonly isDefaultPrevented: () => boolean;
  readonly preventDefault: () => void;
  readonly isPropagationStopped: () => boolean;
  readonly stopPropagation: () => void;
  readonly isImmediatePropagationStopped: () => boolean;
  readonly stopImmediatePropagation: () => void;
}) => void;
