export interface Theme {
  paper: string;
  text: string;
  active: string;
  contrast: string;
  red: string;
  yellow: string;
  blue: string;
  green: string;
  cyan: string;
}

export type Themes = {
  dark: Theme;
  light: Theme;
};

const colors: Themes = {
  dark: {
    paper: '#212121',
    text: '#cfcfcf',
    active: '#36413e',
    contrast: 'white',
    red: 'orange',
    yellow: 'lightgoldenrodyellow',
    blue: '#1a6aaf',
    green: '#02e721',
    cyan: 'cyan',
  },
  light: {
    red: 'red',
    yellow: 'orange',
    blue: '#2748ce',
    paper: '#fff',
    text: '#5d5e60',
    active: 'rgb(182 181 181)',
    contrast: 'black',
    green: 'green',
    cyan: '#0ab1db',
  },
};

export const themes: Themes = {
  dark: colors.dark,
  light: colors.light,
};
