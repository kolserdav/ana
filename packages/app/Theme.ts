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
    yellow: '#ff0',
    blue: '#07f',
    green: '#3f0',
    cyan: '#079',
    black: 'black',
    white: 'white',
  },
  light: {
    type: 'light',
    red: '#ed333b',
    yellow: '#fc6',
    blue: '#69f',
    paper: '#eee',
    text: '#333',
    active: '#bbb',
    contrast: 'black',
    green: '#0c3',
    cyan: '#3ff',
    black: 'black',
    white: 'white',
  },
};

export const themes: Themes = {
  dark: colors.dark,
  light: colors.light,
};
