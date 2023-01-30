import { Theme } from '@/Theme';
import { Locale } from '@/types/interfaces';
import { scrollToTop } from '@/utils/lib';
import { Ubuntu } from '@next/font/google';
import clsx from 'clsx';
import ChevronUpIcon from '../icons/ChevronUp';
import { useAppBar, useChangeTheme } from './AppBar.hooks';
import s from './AppBar.module.scss';
import Menu from './Menu';
import Switch from './Switch';

const ubuntu = Ubuntu({ subsets: ['cyrillic', 'latin'], preload: true, weight: '500' });

function AppBar({
  theme,
  withoutExpandLess,
  full,
  locale,
}: {
  theme: Theme;
  locale: Locale['app']['appBar'];
  withoutExpandLess?: boolean;
  full?: boolean;
}) {
  const { showAppBar, showExpandLess } = useAppBar();

  const { darkTheme, onClickChangeTheme } = useChangeTheme();

  return (
    <header>
      <div
        className={clsx(s.wrapper, ubuntu.className, full ? s.full : '', showAppBar ? s.open : '')}
        style={{
          color: theme.text,
          backgroundColor: full ? theme.active : 'transparent',
          boxShadow: full ? `0px 2px 8px ${theme.active}` : 'none',
        }}
      >
        <Menu theme={theme}>
          <div className={clsx(s.menu__item)}>
            <div style={{ color: theme.text }}>{locale.darkTheme}</div>
            <Switch on={darkTheme} onClick={onClickChangeTheme} theme={theme} />
          </div>
        </Menu>
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
  full: false,
};

export default AppBar;
