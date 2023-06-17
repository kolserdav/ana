import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import storeMenuOpen from '../store/menuOpen';
import storeScroll from '../store/scroll';
import storeTheme, { changeTheme } from '../store/theme';
import storeUserRenew, { changeUserRenew } from '../store/userRenew';
import {
  DEFAULT_THEME,
  EXPAND_LESS_SHOW_FROM,
  MOBILE_WIDTH,
  SUPPORT_TEXT_MAX_LENGHT,
  TEXTAREA_ROWS_DEFAULT,
} from '../utils/constants';
import { CookieName, setCookie } from '../utils/cookies';
import { getLocalStorage, LocalStorageName, setLocalStorage } from '../utils/localStorage';
import storeTouchEvent from '../store/touchEvent';
import {
  Locale,
  LocaleValue,
  MINIMAL_SUPPORT_TEXT_LENGTH,
  UserCleanResult,
} from '../types/interfaces';
import storeShowAppBar, { changeShowAppBar } from '../store/showAppBar';
import { log, shortenString } from '../utils/lib';
import Request from '../utils/request';

const request = new Request();

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
        if (y > oldY || oldY === 0 || y === 0) {
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
   * Set show app bar
   */
  useEffect(() => {
    const { y } = document.body.getBoundingClientRect();
    setShowAppBar(y === 0);
  }, []);

  /**
   * Send show app bar
   */
  useEffect(() => {
    storeShowAppBar.dispatch(changeShowAppBar({ showAppBar }));
  }, [showAppBar]);

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
  const [logoutDialog, setLogoutDialog] = useState<boolean>(false);

  const onClickLogout = () => {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() - 1);
    setCookie(CookieName._utoken, '', { expires });
    setTimeout(() => {
      const { userRenew } = storeUserRenew.getState();
      storeUserRenew.dispatch(changeUserRenew({ userRenew: !userRenew }));
    }, 100);
    setLogoutDialog(false);
  };

  const onClickCancelLogout = () => {
    setLogoutDialog(false);
  };

  const onClickOpenLogoutDialog = () => {
    setLogoutDialog(true);
  };

  const onKeyDownOpenLogoutDialog = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
      onClickOpenLogoutDialog();
    }
  };

  return {
    onClickLogout,
    onKeyDownOpenLogoutDialog,
    logoutDialog,
    setLogoutDialog,
    onClickCancelLogout,
    onClickOpenLogoutDialog,
  };
};

export const useAndroid = () => {
  const [android, setAndroid] = useState<boolean>(false);

  /**
   * Set android
   */
  useEffect(() => {
    if (typeof androidCommon !== 'undefined') {
      setAndroid(true);
    }
  }, []);

  const closeApp = () => {
    if (typeof androidCommon === 'undefined') {
      return;
    }
    androidCommon.closeApp();
  };

  return { android, closeApp };
};

export const useLanguage = () => {
  const router = useRouter();
  const { locales, locale: lang } = router;

  const [language, setLanguage] = useState<LocaleValue>(lang as LocaleValue);

  const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;
    setLanguage(value as LocaleValue);
  };

  /**
   * Change lang
   */
  useEffect(() => {
    if (lang !== language) {
      router.push(router.asPath, router.asPath, { locale: language });
      setLocalStorage(LocalStorageName.INTERFACE_LANGUAGE, language);
    }
  }, [router, lang, language]);

  /**
   * Set lang
   */
  useEffect(() => {
    const savedLang = getLocalStorage(LocalStorageName.INTERFACE_LANGUAGE);
    if (savedLang && savedLang !== lang) {
      setLanguage(savedLang);
    }
  }, [lang]);

  return { onChangeLang, language, locales };
};

export const useSupport = ({
  user,
  setLoad,
  locale,
}: {
  user: UserCleanResult | null;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  locale: Locale['app']['appBar']['support'];
}) => {
  const [supportDialog, setSupportDialog] = useState<boolean>(false);
  const [supportSubject, setSupportSubject] = useState<string>('');
  const [supportSubjectError, setSupportSubjectError] = useState<string>('');
  const [supportTextError, setSupportTextError] = useState<string>('');
  const [supportText, setSupportText] = useState<string>('');
  const [supportTextRows, setSupportTextRows] = useState<number>(TEXTAREA_ROWS_DEFAULT);

  const changeSupportText = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = e as any;

    let _value = value;
    if (value.length > SUPPORT_TEXT_MAX_LENGHT) {
      _value = shortenString(value, SUPPORT_TEXT_MAX_LENGHT);
    }
    if (_value.length >= MINIMAL_SUPPORT_TEXT_LENGTH && supportTextError) {
      setSupportTextError('');
    }
    setSupportText(_value);
  };

  const onChangeSupportSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value && supportSubjectError) {
      setSupportSubjectError('');
    }
    setSupportSubject(value);
  };

  const checkFileds = () => {
    let error = 0;
    if (!supportSubject) {
      error = 1;
      setSupportSubjectError(locale.subjectMustBeNotEmpty);
    }
    if (supportText.length < MINIMAL_SUPPORT_TEXT_LENGTH) {
      error = 1;
      setSupportTextError(locale.minimalLengthOfTextIs);
    }
    return error;
  };

  const cleanFields = () => {
    setSupportText('');
    setSupportTextError('');
    setSupportSubject('');
    setSupportSubjectError('');
    setSupportTextRows(TEXTAREA_ROWS_DEFAULT);
  };

  const onClickSupport = async () => {
    if (!user || checkFileds()) {
      return;
    }
    setLoad(true);
    const res = await request.support({
      subject: supportSubject,
      text: supportText,
      userId: user.id,
      date: new Date().toString(),
    });
    setLoad(false);
    log(res.status, res.message, res, true);
    if (res.status !== 'info') {
      return;
    }
    cleanFields();
    setSupportDialog(false);
  };

  const onClickCancelSupport = () => {
    cleanFields();
    setSupportDialog(false);
  };

  const onClickOpenSupportDialog = () => {
    setSupportDialog(true);
  };

  const onKeyDownOpenSupportDialog = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
      onClickOpenSupportDialog();
    }
  };

  const onBlurSupportSubject = () => {
    //
  };

  return {
    onClickSupport,
    onKeyDownOpenSupportDialog,
    supportDialog,
    setSupportDialog,
    onClickCancelSupport,
    onClickOpenSupportDialog,
    onChangeSupportSubject,
    onBlurSupportSubject,
    supportSubject,
    supportSubjectError,
    changeSupportText,
    supportText,
    supportTextRows,
    supportTextError,
  };
};
