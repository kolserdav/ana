import { PageField } from '@prisma/client';

export type ThemeType = 'light' | 'dark';

export type PageFull = {
  [K in PageField]: string;
};

export interface IconProps {
  width?: number;
  height?: number;
  children: string;
  color?: string;
}
