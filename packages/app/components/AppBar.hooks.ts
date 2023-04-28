import { useEffect, useState } from 'react';
import storeMenuOpen from '../store/menuOpen';
import storeScroll from '../store/scroll';
import storeTheme, { changeTheme } from '../store/theme';
import storeUserRenew, { changeUserRenew } from '../store/userRenew';
import { DEFAULT_THEME, EXPAND_LESS_SHOW_FROM, MOBILE_WIDTH } from '../utils/constants';
import { CookieName, setCookie } from '../utils/cookies';
import { getLocalStorage, LocalStorageName, setLocalStorage } from '../utils/localStorage';
import storeTouchEvent from '../store/touchEvent';

let oldY = 0;
let mayChange = true;

// eslint-disable-next-line import/prefer-default-export
export const useAppBar = () => {
  const [showAppBar, setShowAppBar] = useState<boolean>(true);
  const [showExpandLess, setShowExpandLess] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>();

  /**
   * Set is mobile
   */
  useEffect(() => {
    setIsMobile(window.innerWidth <= MOBILE_WIDTH);
  }, []);

  /**
   * Listen scroll
   */
  useEffect(() => {
    const hideOnScroll = () => {
      const rects = document.body.getBoundingClientRect();
      const { y } = rects;
      if (mayChange) {
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
      }
    };
    const cleanSubs = storeScroll.subscribe(hideOnScroll);
    return () => {
      cleanSubs();
    };
  }, [menuOpen]);

  /**
   * Listen touch events
   */
  useEffect(() => {
    const cleanSubs = storeTouchEvent.subscribe(() => {
      const { touchEvent } = storeTouchEvent.getState();
      switch (touchEvent) {
        case 'start':
          mayChange = false;
          break;
        case 'end':
          mayChange = true;
          break;
        default:
      }
    });

    return () => {
      cleanSubs();
    };
  }, []);

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

  return { showAppBar, showExpandLess, menuOpen, isMobile };
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

export const useLogout = () => {
  const onClickLogout = () => {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() - 1);
    setCookie(CookieName._utoken, '', { expires });
    setTimeout(() => {
      const { userRenew } = storeUserRenew.getState();
      storeUserRenew.dispatch(changeUserRenew({ userRenew: !userRenew }));
    }, 100);
  };

  const onKeyDownLogout = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
      onClickLogout();
    }
  };

  return { onClickLogout, onKeyDownLogout };
};
