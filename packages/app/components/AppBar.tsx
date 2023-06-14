import clsx from 'clsx';

import { useRouter } from 'next/router';
import { useRef } from 'react';
import { ubuntu500 } from '../fonts/ubuntu';
import { Theme } from '../Theme';
import { Locale, LocaleValue, UserCleanResult } from '../types/interfaces';
import { Pages, PAGE_LOGIN_IN_MENU, MENU_TRANSITION, LOCALE_NAMES } from '../utils/constants';
import { checkRouterPath, scrollToTop } from '../utils/lib';
import ChevronUpIcon from './icons/ChevronUp';
import { useAndroid, useAppBar, useChangeTheme, useLanguage, useLogout } from './AppBar.hooks';
import s from './AppBar.module.scss';
import Link from './ui/Link';
import Menu from './ui/Menu';
import Switch from './ui/Switch';
import l from './ui/Link.module.scss';
import p from '../styles/Page.module.scss';
import TranslateIcon from './icons/Translate';
import Select from './ui/Select';
import Hr from './ui/Hr';
import Dialog from './ui/Dialog';
import Typography from './ui/Typography';
import Button from './ui/Button';

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
  user: UserCleanResult | null;
  full?: boolean;
}) {
  const router = useRouter();
  const localeRef = useRef<HTMLSelectElement>(null);

  const { showAppBar, showExpandLess, menuOpen, isMobile } = useAppBar();

  const { darkTheme, onClickChangeTheme } = useChangeTheme();

  const {
    onClickLogout,
    onKeyDownOpenLogoutDialog,
    logoutDialog,
    setLogoutDialog,
    onClickCancelLogout,
    onClickOpenLogoutDialog,
  } = useLogout();

  const linkStyle: React.CSSProperties =
    menuOpen && isMobile
      ? {
          color: 'transparent',
          textShadow: `0 0 8px ${theme.text}`,
          transition: `all ${MENU_TRANSITION / 1000}s ease-out`,
        }
      : { color: theme.text, transition: `all ${MENU_TRANSITION / 1000}s ease-in` };

  const { android, closeApp } = useAndroid();

  const { locales, language, onChangeLang } = useLanguage();

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
            <div className={s.items}>
              {!checkRouterPath(router.asPath, Pages.translate) && (
                <Link noWrap theme={theme} href={Pages.translate} className={s.item}>
                  <div className={s.menu__item}>
                    <div style={linkStyle}>{locale.translate}</div>
                  </div>
                </Link>
              )}
              {!checkRouterPath(router.asPath, Pages.myDictionary) && user && (
                <Link noWrap theme={theme} href={Pages.myDictionary} className={s.item}>
                  <div className={s.menu__item}>
                    <div style={linkStyle}>{locale.myDictionary}</div>
                  </div>
                </Link>
              )}
            </div>
            {typeof isMobile === 'boolean' && !isMobile && (
              <div className={s.actions}>
                <TranslateIcon withoutScale color={theme.text} />
                <Select
                  ref={localeRef}
                  onChange={onChangeLang}
                  active
                  theme={theme}
                  value={language}
                >
                  {(locales as LocaleValue[])?.map((item) => (
                    <option value={item} key={item}>
                      {LOCALE_NAMES[item]}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>
        )}
        <Menu openMenu={menuOpen ? locale.closeMenu : locale.openMenu} theme={theme}>
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
          <Hr theme={theme} />
          <div className={clsx(s.menu__item)}>
            <div style={{ color: theme.text }}>{locale.darkTheme}</div>
            <Switch on={darkTheme} onClick={onClickChangeTheme} theme={theme} />
          </div>
          {(isMobile || !full) && (
            <div className={s.menu__item}>
              <TranslateIcon color={theme.text} />
              <Select ref={localeRef} onChange={onChangeLang} active theme={theme} value={language}>
                {(locales as LocaleValue[])?.map((item) => (
                  <option value={item} key={item}>
                    {LOCALE_NAMES[item]}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {!checkRouterPath(router.asPath, [Pages.settings]) && (
            <Link withoutHover fullWidth theme={theme} href={Pages.settings}>
              <div className={clsx(s.menu__item, s.active)}>
                <div style={{ color: theme.text }}>{locale.settings}</div>
              </div>
            </Link>
          )}
          <Hr theme={theme} />
          <div className={s.bottom}>
            {!checkRouterPath(router.asPath, [Pages.about]) && (
              <Link withoutHover fullWidth theme={theme} href={Pages.about}>
                <div className={clsx(s.menu__item, s.active)}>
                  <div style={{ color: theme.text }}>{locale.about}</div>
                </div>
              </Link>
            )}
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
                onKeyDown={onKeyDownOpenLogoutDialog}
                tabIndex={-1}
                onClick={onClickOpenLogoutDialog}
                className={clsx(l.wrapper, l.full__width, l.without__hover)}
              >
                <div className={clsx(s.menu__item, s.active)}>
                  <div style={{ color: theme.text }}>{locale.logout}</div>
                </div>
              </div>
            )}
            {android && (
              <Link onClick={closeApp} withoutHover fullWidth theme={theme} href="#close">
                <div className={clsx(s.menu__item, s.active)}>
                  <div style={{ color: theme.text }}>{locale.closeApp}</div>
                </div>
              </Link>
            )}
          </div>
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
      <Dialog className={p.dialog} theme={theme} onClose={setLogoutDialog} open={logoutDialog}>
        <Typography variant="h3" theme={theme} align="center">
          {`${locale.logout}?`}
        </Typography>
        <Typography variant="p" theme={theme}>
          {locale.logoutDesc}
        </Typography>
        <div className={p.dialog__actions}>
          <Button className={s.button} onClick={onClickCancelLogout} theme={theme}>
            {locale.no}
          </Button>
          <div className={p.button_margin} />
          <Button className={s.button} onClick={onClickLogout} theme={theme}>
            {locale.yes}
          </Button>
        </div>
      </Dialog>
    </header>
  );
}

AppBar.defaultProps = {
  withoutExpandLess: false,
  full: false,
};

export default AppBar;
