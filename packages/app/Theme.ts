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
    active: '#222f3e',
    contrast: 'white',
    red: 'red',
    yellow: 'yellow',
    blue: '#1a6aaf',
    green: '#02e721',
    cyan: '#0ab1db',
    black: 'black',
    white: 'white',
  },
  light: {
    type: 'light',
    red: 'red',
    yellow: 'orange',
    blue: 'dodgerblue',
    paper: '#fff',
    text: '#5d5e60',
    active: '#a9afb5',
    contrast: 'black',
    green: 'green',
    cyan: 'cyan',
    black: 'black',
    white: 'white',
  },
};

export const themes: Themes = {
  dark: colors.dark,
  light: colors.light,
};
