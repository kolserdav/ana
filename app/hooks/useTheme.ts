import { useEffect, useState } from 'react';
import storeTheme from '@/store/theme';
import { Theme, themes } from '@/Theme';
import { ThemeType } from '@/types';
import { getLocalStorage, LocalStorageName } from '@/utils/localStorage';
import { DEFAULT_THEME } from '@/utils/constants';

export default function useTheme() {
  const [themeName, setThemeName] = useState<ThemeType>(
    getLocalStorage(LocalStorageName.THEME) || DEFAULT_THEME
  );
  const [theme, setTheme] = useState<Theme>(themes[themeName]);

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

  return { themeName, theme };
}
