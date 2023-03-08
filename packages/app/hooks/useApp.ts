import { useEffect, useMemo, useState } from 'react';
import useTheme from './useTheme';
import storeClick, { changeClick } from '../store/click';
import storeLoad from '../store/load';
import storeScroll, { changeScroll } from '../store/scroll';
import { log, setBodyScroll } from '../utils/lib';
import useWS from './useWS';
import { LOCALE_DEFAULT, MessageType, SendMessageArgs } from '../types/interfaces';
import { CookieName, getCookie } from '../utils/cookies';

export default function useApp({
  user,
}: {
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'] | null;
}) {
  const [load, setLoad] = useState<boolean>(true);
  const [touchpad, setTouchpad] = useState<boolean>(false);

  const { theme } = useTheme();

  const { ws } = useWS({ protocol: 'app' });

  const setConnectionId = useMemo(
    () =>
      ({ id, data }: SendMessageArgs<MessageType.SET_CONNECTION_ID>) => {
        if (!user) {
          return;
        }
        if (data) {
          // START app
          return;
        }
        ws.sendMessage({
          id,
          type: MessageType.GET_CONNECTION_ID,
          lang: getCookie(CookieName.lang) || LOCALE_DEFAULT,
          timeout: new Date().getTime(),
          data: {
            newId: user.id,
          },
        });
      },
    [user, ws]
  );

  /**
   * Handle ws messages
   */
  useEffect(() => {
    if (!ws.connection || !user) {
      return;
    }
    ws.connection.onmessage = (e) => {
      const rawMessage = ws.parseMessage(e.data);
      if (!rawMessage) {
        log('warn', 'Skip handle message', { rawMessage });
        return;
      }
      const { type } = rawMessage;
      switch (type) {
        case MessageType.SET_CONNECTION_ID:
          setConnectionId(rawMessage);
          break;
        default:
          log('warn', 'Default case WS message on app', { rawMessage });
      }
    };
  }, [ws, user, setConnectionId]);

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

  return { load, setLoad, theme, touchpad };
}
