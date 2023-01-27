import storeMenuOpen from '@/store/menuOpen';
import storeScroll from '@/store/scroll';
import { Theme } from '@/Theme';
import { EXPAND_LESS_SHOW_FROM } from '@/utils/constants';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ChevronUpIcon from '../icons/ChevronUp';
import s from './AppBar.module.scss';
import Menu from './Menu';

let oldY = 0;

function AppBar({ theme, withoutExpandLess }: { theme: Theme; withoutExpandLess?: boolean }) {
  const [showAppBar, setShowAppBar] = useState<boolean>(true);
  const [showExpandLess, setShowExpandLess] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <header>
      <div
        className={clsx(s.wrapper, showAppBar ? s.open : '')}
        style={{
          color: theme.text,
          backgroundColor: theme.active,
          boxShadow: `0px 2px 8px ${theme.active}`,
        }}
      >
        <Menu theme={theme} />
      </div>
      {!withoutExpandLess && (
        <button
          type="button"
          className={clsx(s.expand__less, showExpandLess ? s.open : '')}
          style={{ backgroundColor: theme.active }}
          onClick={scrollToTop}
        >
          <ChevronUpIcon />
        </button>
      )}
    </header>
  );
}

AppBar.defaultProps = {
  withoutExpandLess: false,
};

export default AppBar;
