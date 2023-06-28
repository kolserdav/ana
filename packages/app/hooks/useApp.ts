import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useTheme from './useTheme';
import storeClick, { changeClick } from '../store/click';
import storeLoad from '../store/load';
import storeScroll, { changeScroll } from '../store/scroll';
import { log, setBodyScroll } from '../utils/lib';
import {
  LOCALE_DEFAULT,
  LocaleValue,
  UserCleanResult,
  WS_MESSAGE_COMMENT_SERVER_RELOAD,
  WS_MESSAGE_CONN_ID,
  WS_MESSAGE_LOCALE,
  WS_MESSAGE_USER_ID,
  parseMessage,
} from '../types/interfaces';
import storeTouchEvent, { changeTouchEvent } from '../store/touchEvent';
import { CookieName, getCookie, setCookie } from '../utils/cookies';
import { WS_ADDRESS } from '../utils/constants';
import useLoad from './useLoad';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import storeMenuOpen from '../store/menuOpen';

let global: GlobalProps = {};
if (typeof window !== 'undefined') {
  global = {};
}

let oldPath: string;

export default function useApp({
  user,
  userLoad,
  connectionReOpened,
  connectionRefused,
}: {
  user: UserCleanResult | null;
  userLoad: boolean;
  connectionRefused: string;
  connectionReOpened: string;
}) {
  const router = useRouter();
  const { load, setLoad } = useLoad();
  const [connId, setConnId] = useState<string | null>(null);
  const [touchpad, setTouchpad] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>();
  const [acceptCookies, setAcceptCookies] = useState<boolean>(
    getLocalStorage(LocalStorageName.ACCEPT_POLICY) || false
  );
  const [showAcceptCookies, setShowAcceptCookeis] = useState<boolean>(false);
  const [urlDefault, setUrlDefault] = useState<string>();

  const getUrlDefault = useCallback((d: string) => {
    log('info', 'Set url default is', d);
    setUrlDefault(d);
  }, []);

  /**
   * Set url default
   */
  useEffect(() => {
    if (!global) {
      return;
    }
    if (typeof androidCommon === 'undefined') {
      setUrlDefault(window.location.origin);
    } else if (androidCommon.getUrlDefault) {
      androidCommon.getUrlDefault('getUrlDefault');
    }
  }, [getUrlDefault]);

  const onClickAcceptCookies = () => {
    setAcceptCookies(true);
    setLocalStorage(LocalStorageName.ACCEPT_POLICY, true);
  };

  /**
   * Set show accept cookeis
   */
  useEffect(() => {
    const isApp = typeof window !== 'undefined';
    if (isApp) {
      setShowAcceptCookeis(true);
    }
  }, []);

  /**
   * Listen change router.pathname
   */
  useEffect(() => {
    const _oldPath = router.pathname;
    if (!oldPath) {
      oldPath = _oldPath;
    }
    const { menuOpen } = storeMenuOpen.getState();
    if (menuOpen && oldPath !== _oldPath) {
      oldPath = _oldPath;
      storeClick.dispatch(changeClick({ clientX: 0, clientY: 0 }));
    }
  }, [router.pathname]);

  const ws = useMemo(() => {
    if (!userLoad) {
      return null;
    }
    log('info', 'Creating WS connection', { restart, userLoad, WS_ADDRESS });
    return typeof WebSocket !== 'undefined' ? new WebSocket(WS_ADDRESS) : null;
  }, [restart, userLoad]);

  const { theme } = useTheme();

  /**
   * Listen server messages
   */
  useEffect(() => {
    if (!ws) {
      return;
    }

    ws.onopen = () => {
      log('info', 'Open WS connection', {});
      if (getLocalStorage(LocalStorageName.SERVER_RELOAD)) {
        log('info', connectionReOpened, {}, true);
        setLocalStorage(LocalStorageName.SERVER_RELOAD, false);
      }

      ws.send(
        JSON.stringify({
          type: 'info',
          message: WS_MESSAGE_LOCALE,
          data: router.locale || LOCALE_DEFAULT,
        })
      );
    };

    ws.onmessage = ({
      data,
    }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MessageEvent<string>) => {
      const parsed = parseMessage(data);
      if (!parsed) {
        return;
      }
      log('info', 'On WS message', parsed);
      const { type, message, data: _data, forUser, infinity } = parsed;

      switch (message) {
        case WS_MESSAGE_CONN_ID:
          setLoad(false);
          setConnId(_data);
          if (user) {
            ws.send(
              JSON.stringify({
                type: 'info',
                message: WS_MESSAGE_USER_ID,
                data: user.id,
                token: getCookie(CookieName._utoken) || '',
              })
            );
          }
          break;
        default:
          log(type, message, _data, forUser, infinity);
          if (_data === WS_MESSAGE_COMMENT_SERVER_RELOAD) {
            setLocalStorage(LocalStorageName.SERVER_RELOAD, true);
          }
      }
    };

    ws.onerror = (e) => {
      log('error', 'Error ws', e);
    };

    ws.onclose = (e) => {
      if (getLocalStorage(LocalStorageName.SERVER_RELOAD)) {
        log('warn', connectionRefused, e, true);
      }
      setLoad(true);

      setRestart(restart === undefined ? false : !restart);

      setConnId(null);
    };
  }, [
    ws,
    router.locale,
    restart,
    setLoad,
    connectionReOpened,
    connectionRefused,
    user,
    router.asPath,
  ]);

  /**
   * Set lang cookie
   */
  useEffect(() => {
    if (!router.locale) {
      return;
    }
    setCookie(CookieName.lang, router.locale as LocaleValue);
  }, [router.locale]);

  /**
   * Scroll handler
   */
  useEffect(() => {
    const scrollHandler = () => {
      const { scroll } = storeScroll.getState();
      storeScroll.dispatch(changeScroll({ scroll: !scroll }));
    };
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  /**
   * Listen focus
   */
  useEffect(() => {
    if (!ws) {
      return () => {
        /** */
      };
    }
    const onFocusHandler = () => {
      if (ws.readyState !== 1) {
        setRestart(restart === undefined ? true : !restart);
      }
    };
    window.addEventListener('focus', onFocusHandler);

    return () => {
      window.removeEventListener('focus', onFocusHandler);
    };
  }, [restart, ws]);

  /**
   * Touch start handler
   */
  useEffect(() => {
    const touchHandler = () => {
      storeTouchEvent.dispatch(changeTouchEvent({ touchEvent: 'start' }));
    };
    window.addEventListener('touchstart', touchHandler);
    return () => {
      window.removeEventListener('touchstart', touchHandler);
    };
  }, []);

  /**
   * Touch end handler
   */
  useEffect(() => {
    const touchHandler = () => {
      storeTouchEvent.dispatch(changeTouchEvent({ touchEvent: 'end' }));
    };
    window.addEventListener('touchend', touchHandler);
    return () => {
      window.removeEventListener('touchend', touchHandler);
    };
  }, []);

  /**
   * Click handler
   */
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      storeClick.dispatch(changeClick({ clientX, clientY }));
    };
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, []);

  /**
   * Set body scroll
   */
  useEffect(() => {
    setBodyScroll(true);
  }, []);

  /**
   * Listen load
   */
  useEffect(() => {
    const cleanSubs = storeLoad.subscribe(() => {
      const { load: _load } = storeLoad.getState();
      setLoad(_load);
    });
    return () => {
      cleanSubs();
    };
  }, [setLoad]);

  useEffect(() => {
    const touchpadHandler = () => {
      setTouchpad(true);
    };
    window.addEventListener('touchstart', touchpadHandler);
    return () => {
      window.removeEventListener('touchstart', touchpadHandler);
    };
  }, []);

  return {
    load,
    setLoad,
    theme,
    touchpad,
    connId,
    acceptCookies,
    onClickAcceptCookies,
    showAcceptCookies,
  };
}
