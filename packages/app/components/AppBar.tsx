import clsx from 'clsx';
import { useRouter } from 'next/router';
import { ubuntu500 } from '../fonts/ubuntu';
import { Theme } from '../Theme';
import { Locale, UserCleanResult } from '../types/interfaces';
import { Pages, PAGE_LOGIN_IN_MENU } from '../utils/constants';
import { checkRouterPath, scrollToTop } from '../utils/lib';
import ChevronUpIcon from './icons/ChevronUp';
import { useAppBar, useChangeTheme, useLogout } from './AppBar.hooks';
import s from './AppBar.module.scss';
import Link from './ui/Link';
import Menu from './ui/Menu';
import Switch from './ui/Switch';
import l from './ui/Link.module.scss';

function AppBar({
  theme,
  withoutExpandLess,
  full,
  locale,
  user,
}: {
  theme: Theme;
  locale: Locale['app']['appBar'];
  withoutExpandLess?: boolean;
  user: UserCleanResult;
  full?: boolean;
}) {
  const router = useRouter();

  const { showAppBar, showExpandLess } = useAppBar();

  const { darkTheme, onClickChangeTheme } = useChangeTheme();

  const { onClickLogout, onKeyDownLogout } = useLogout();

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
          boxShadow: full ? `0px 1px 2px ${theme.active}` : 'none',
        }}
      >
        {full && (
          <div className={s.links}>
            {!checkRouterPath(router.asPath, Pages.home) && (
              <Link noWrap theme={theme} href={Pages.home} className={s.item}>
                <div className={s.menu__item}>
                  <div style={{ color: theme.text }}>{locale.homePage}</div>
                </div>
              </Link>
            )}
            {!checkRouterPath(router.asPath, Pages.translate) && (
              <Link noWrap theme={theme} href={Pages.translate} className={s.item}>
                <div className={s.menu__item}>
                  <div style={{ color: theme.text }}>{locale.translate}</div>
                </div>
              </Link>
            )}
            {!checkRouterPath(router.asPath, Pages.myDictionary) && user && (
              <Link noWrap theme={theme} href={Pages.myDictionary} className={s.item}>
                <div className={s.menu__item}>
                  <div style={{ color: theme.text }}>{locale.myDictionary}</div>
                </div>
              </Link>
            )}
          </div>
        )}
        <Menu theme={theme}>
          {!checkRouterPath(router.asPath, Pages.home) && (
            <Link fullWidth withoutHover theme={theme} href={Pages.home}>
              <div className={clsx(s.menu__item, s.active)}>
                <div style={{ color: theme.text }}>{locale.homePage}</div>
              </div>
            </Link>
          )}
          {!checkRouterPath(router.asPath, Pages.translate) && (
            <Link withoutHover fullWidth theme={theme} href={Pages.translate}>
              <div className={clsx(s.menu__item, s.active)}>
                <div style={{ color: theme.text }}>{locale.translate}</div>
              </div>
            </Link>
          )}
          {!checkRouterPath(router.asPath, Pages.myDictionary) && user && (
            <Link withoutHover fullWidth theme={theme} href={Pages.myDictionary}>
              <div className={clsx(s.menu__item, s.active)}>
                <div style={{ color: theme.text }}>{locale.myDictionary}</div>
              </div>
            </Link>
          )}
          <div className={clsx(s.menu__item)}>
            <div style={{ color: theme.text }}>{locale.darkTheme}</div>
            <Switch on={darkTheme} onClick={onClickChangeTheme} theme={theme} />
          </div>
          {!checkRouterPath(router.asPath, [Pages.signIn, Pages.signUp]) && !user && (
            <Link withoutHover fullWidth theme={theme} href={PAGE_LOGIN_IN_MENU}>
              <div className={clsx(s.menu__item, s.active)}>
                <div style={{ color: theme.text }}>{locale.login}</div>
              </div>
            </Link>
          )}
          {user && (
            <div
              role="button"
              onKeyDown={onKeyDownLogout}
              tabIndex={-1}
              onClick={onClickLogout}
              className={clsx(l.wrapper, l.full__width, l.without__hover)}
            >
              <div className={clsx(s.menu__item, s.active)}>
                <div style={{ color: theme.text }}>{locale.logout}</div>
              </div>
            </div>
          )}
        </Menu>
      </div>
      {!withoutExpandLess && (
        <button
          type="button"
          className={clsx(s.expand__less, showExpandLess ? s.open : '')}
          style={{ backgroundColor: theme.active, border: `1px groove ${theme.paper}` }}
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
