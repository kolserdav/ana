import storeMenuOpen from '@/store/menuOpen';
import storeScroll from '@/store/scroll';
import storeTheme, { changeTheme } from '@/store/theme';
import { DEFAULT_THEME, EXPAND_LESS_SHOW_FROM } from '@/utils/constants';
import { getLocalStorage, LocalStorageName, setLocalStorage } from '@/utils/localStorage';
import { useEffect, useState } from 'react';

let oldY = 0;

// eslint-disable-next-line import/prefer-default-export
export const useAppBar = () => {
  const [showAppBar, setShowAppBar] = useState<boolean>(true);
  const [showExpandLess, setShowExpandLess] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  /**
   * Listen scroll
   */
  useEffect(() => {
    const hideOnScroll = () => {
      const rects = document.body.getBoundingClientRect();
      const { y } = rects;
      if (y > oldY || oldY === 0) {
        setShowAppBar(true);
      } else if (!menuOpen) {
        setShowAppBar(false);
      }
      oldY = y;
      if (y < EXPAND_LESS_SHOW_FROM && !menuOpen) {
        setShowExpandLess(true);
      } else {
        setShowExpandLess(false);
      }
    };
    const cleanSubs = storeScroll.subscribe(hideOnScroll);
    return () => {
      cleanSubs();
    };
  }, [menuOpen]);

  /**
   * Listen menu open
   */
  useEffect(() => {
    const cleanSubs = storeMenuOpen.subscribe(() => {
      const { menuOpen: _menuOpen } = storeMenuOpen.getState();
      setMenuOpen(_menuOpen);
    });
    return () => {
      cleanSubs();
    };
  }, []);

  return { showAppBar, showExpandLess };
};

export const useChangeTheme = () => {
  const [darkTheme, setDarkTheme] = useState<boolean>(DEFAULT_THEME === 'dark');

  /**
   * Set saved theme
   */
  useEffect(() => {
    const savedTheme = getLocalStorage(LocalStorageName.THEME);
    if (savedTheme && savedTheme !== DEFAULT_THEME) {
      setDarkTheme(savedTheme === 'dark');
    }
  }, []);

  const onClickChangeTheme = (value: boolean) => {
    const theme = value ? 'dark' : 'light';
    storeTheme.dispatch(changeTheme({ theme }));
    setLocalStorage(LocalStorageName.THEME, theme);
    setDarkTheme(value);
  };

  return { darkTheme, onClickChangeTheme };
};
