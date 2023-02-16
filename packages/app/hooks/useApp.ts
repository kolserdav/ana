import { useEffect, useState } from 'react';
import useTheme from './useTheme';
import storeClick, { changeClick } from '../store/click';
import storeLoad from '../store/load';
import storeScroll, { changeScroll } from '../store/scroll';
import { setBodyScroll } from '../utils/lib';

export default function useApp() {
  const [load, setLoad] = useState<boolean>(true);
  const [touchpad, setTouchpad] = useState<boolean>(false);

  const { theme } = useTheme();

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
