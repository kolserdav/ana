import { ubuntu500 } from '@/fonts/ubuntu';
import { Theme } from '@/Theme';
import { Locale } from '@/types/interfaces';
import { Pages, PAGE_LOGIN_IN_MENU } from '@/utils/constants';
import { checkRouterPath, scrollToTop } from '@/utils/lib';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import ChevronUpIcon from '../icons/ChevronUp';
import { useAppBar, useChangeTheme } from './AppBar.hooks';
import s from './AppBar.module.scss';
import Link from './Link';
import Menu from './Menu';
import Switch from './Switch';

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
  const router = useRouter();

  const { showAppBar, showExpandLess } = useAppBar();

  const { darkTheme, onClickChangeTheme } = useChangeTheme();

  return (
    <header>
      <div
        className={clsx(
          s.wrapper,
          ubuntu500.className,
          full ? s.full : '',
          showAppBar ? s.open : ''
        )}
        style={{
          color: theme.text,
          backgroundColor: full ? theme.active : 'transparent',
          boxShadow: full ? `0px 2px 8px ${theme.active}` : 'none',
        }}
      >
        <Menu theme={theme}>
          {!checkRouterPath(router.asPath, Pages.home) && (
            <Link fullWidth withoutHover theme={theme} href={Pages.home}>
              <div className={clsx(s.menu__item, s.active)}>
                <div style={{ color: theme.text }}>{locale.homePage}</div>
              </div>
            </Link>
          )}
          <div className={clsx(s.menu__item)}>
            <div style={{ color: theme.text }}>{locale.darkTheme}</div>
            <Switch on={darkTheme} onClick={onClickChangeTheme} theme={theme} />
          </div>
          {!checkRouterPath(router.asPath, [Pages.signIn, Pages.signUp]) && (
            <Link withoutHover fullWidth theme={theme} href={PAGE_LOGIN_IN_MENU}>
              <div className={clsx(s.menu__item, s.active)}>
                <div style={{ color: theme.text }}>{locale.login}</div>
              </div>
            </Link>
          )}
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
