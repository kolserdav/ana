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

const colors: Themes = {
  dark: {
    type: 'dark',
    paper: '#212121',
    text: '#cfcfcf',
    active: '#1a5fb4',
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
    blue: '#62a0ea',
    paper: '#fff',
    text: '#5d5e60',
    active: '#999',
    contrast: 'black',
    green: '#57e389',
    cyan: 'cyan',
    black: 'black',
    white: 'white',
  },
};

export const themes: Themes = {
  dark: colors.dark,
  light: colors.light,
};
