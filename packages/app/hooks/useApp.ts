import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useTheme from './useTheme';
import storeClick, { changeClick } from '../store/click';
import storeLoad from '../store/load';
import storeScroll, { changeScroll } from '../store/scroll';
import { log, setBodyScroll } from '../utils/lib';
import {
  LocaleValue,
  UserCleanResult,
  WSMessage,
  WS_MESSAGE_CONN_ID,
  parseMessage,
} from '../types/interfaces';
import storeTouchEvent, { changeTouchEvent } from '../store/touchEvent';
import { CookieName, setCookie } from '../utils/cookies';
import { WS_ADDRESS } from '../utils/constants';

export default function useApp({ user }: { user: UserCleanResult | null }) {
  const router = useRouter();
  const [load, setLoad] = useState<boolean>(true);
  const [connId, setConnId] = useState<string | null>(null);
  const [touchpad, setTouchpad] = useState<boolean>(false);
  const ws = useMemo(
    () => (typeof WebSocket !== 'undefined' ? new WebSocket(WS_ADDRESS) : null),
    []
  );

  const { theme } = useTheme();

  /**
   * Listen server messages
   */
  useEffect(() => {
    if (!ws) {
      return;
    }

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
          setConnId(_data);
          break;
        default:
          log(type, message, _data, forUser, infinity);
      }
    };

    ws.onerror = (e) => {
      log('error', 'Error ws', e);
    };

    ws.onclose = (e) => {
      log('warn', 'Conn is closeed', e);
    };
  }, [ws]);

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

  return { load, setLoad, theme, touchpad, connId };
}
