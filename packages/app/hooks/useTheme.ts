import { useEffect, useState } from 'react';
import storeTheme from '../store/theme';
import { Theme, themes, ThemeType } from '../Theme';
import { getLocalStorage, LocalStorageName } from '../utils/localStorage';
import { DEFAULT_THEME } from '../utils/constants';

export default function useTheme() {
  const [themeName, setThemeName] = useState<ThemeType>(DEFAULT_THEME);
  const [theme, setTheme] = useState<Theme>(themes[themeName]);

  /**
   * Set saved theme
   */
  useEffect(() => {
    const savedTheme = getLocalStorage(LocalStorageName.THEME) || DEFAULT_THEME;
    if (savedTheme && savedTheme !== DEFAULT_THEME) {
      setTheme(themes[savedTheme]);
    }
  }, []);

  /**
   * Listen change theme
   */
  useEffect(() => {
    const cleanSubs = storeTheme.subscribe(() => {
      const { theme: _theme } = storeTheme.getState();
      setThemeName(_theme);
      setTheme(themes[_theme]);
    });
    return () => {
      cleanSubs();
    };
  }, []);

  /**
   * Set body colors
   */
  useEffect(() => {
    document.body.setAttribute('style', `background-color: ${theme.paper}`);
  }, [theme.paper]);

  return { themeName, theme };
}
