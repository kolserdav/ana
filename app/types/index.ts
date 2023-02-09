import { Theme } from '@/Theme';
import { PageField } from '@prisma/client';
import { Locale, MessageType, SendMessageArgs, Status } from './interfaces';

export type ThemeType = 'light' | 'dark';

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
