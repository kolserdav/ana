import { PageField } from '@prisma/client';

export type ThemeType = 'light' | 'dark';

export type PageFull = {
  [K in PageField]: string;
};
