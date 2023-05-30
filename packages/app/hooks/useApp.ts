import { useEffect, useMemo, useState } from 'react';
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
  WS_MESSAGE_CONN_ID,
  WS_MESSAGE_LOCALE,
  parseMessage,
} from '../types/interfaces';
import storeTouchEvent, { changeTouchEvent } from '../store/touchEvent';
import { CookieName, setCookie } from '../utils/cookies';
import { WS_ADDRESS } from '../utils/constants';
import useLoad from './useLoad';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';

let quiet = false;

export default function useApp({
  user,
  connectionReOpened,
  connectionRefused,
}: {
  user: UserCleanResult | null;
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

  const ws = useMemo(() => {
    log('info', 'Creating WS connection', { restart });
    return typeof WebSocket !== 'undefined' ? new WebSocket(WS_ADDRESS) : null;
  }, [restart]);

  const { theme } = useTheme();
  const loadConnect = typeof restart === 'undefined';

  /**
   * Listen server messages
   */
  useEffect(() => {
    if (!ws) {
      return;
    }

    ws.onopen = () => {
      if (!loadConnect) {
        if (!quiet && document.hasFocus()) {
          log('info', connectionReOpened, {}, true);
        }
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
      const { type, message, data: _data, forUser, infinity } = parsed;

      switch (message) {
        case WS_MESSAGE_CONN_ID:
          setLoad(false);
          setConnId(_data);
          break;
        default:
          log(type, message, _data, forUser, infinity);
      }
    };

    let error = false;
    ws.onerror = (e) => {
      log('error', 'Error ws', e);
      error = true;
    };

    ws.onclose = (e) => {
      if (!error && document.hasFocus()) {
        log('warn', connectionRefused, e, true);
      }
      setLoad(true);
      quiet = false;
      setRestart(loadConnect ? true : !restart);
      setConnId(null);
    };
  }, [ws, router.locale, loadConnect, restart, setLoad, connectionReOpened, connectionRefused]);

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
        quiet = true;
        setRestart(loadConnect ? true : !restart);
      }
    };
    window.addEventListener('focus', onFocusHandler);

    return () => {
      window.removeEventListener('focus', onFocusHandler);
    };
  }, [loadConnect, restart, ws]);

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
  }, []);

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
