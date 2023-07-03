export type ThemeType = 'light' | 'dark';

export interface Theme {
  type: ThemeType;
  paper: string;
  text: string;
  active: string;
  contrast: string;
  red: string;
  yellow: string;
  blue: string;
  green: string;
  cyan: string;
  black: string;
  white: string;
}

export type Themes = {
  dark: Theme;
  light: Theme;
};

// 035
const colors: Themes = {
  dark: {
    type: 'dark',
    paper: '#222',
    text: '#ccc ',
    active: '#333',
    contrast: 'white',
    red: 'red',
    yellow: 'yellow',
    blue: '#1a6aaf',
    green: '#26a269',
    cyan: '#0ab1db',
    black: 'black',
    white: 'white',
  },
  light: {
    type: 'light',
    red: '#ed333b',
    yellow: 'orange',
    blue: '#36c',
    paper: '#eee',
    text: '#333',
    active: '#bbb',
    contrast: 'black',
    green: '#3c6',
    cyan: 'cyan',
    black: 'black',
    white: 'white',
  },
};

export const themes: Themes = {
  dark: colors.dark,
  light: colors.light,
};
