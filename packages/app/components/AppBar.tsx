import clsx from 'clsx';

import { useRouter } from 'next/router';
import { useRef } from 'react';
import { ubuntu500 } from '../fonts/ubuntu';
import { Theme } from '../Theme';
import { Locale, LocaleValue, UserCleanResult } from '../types/interfaces';
import {
  Pages,
  PAGE_LOGIN_IN_MENU,
  MENU_TRANSITION,
  LOCALE_NAMES,
  SUPPORT_TEXT_MAX_LENGHT,
  SUPPORT_SUBJECT_MAX_LENGTH,
} from '../utils/constants';
import { checkRouterPath, scrollToTop } from '../utils/lib';
import ChevronUpIcon from './icons/ChevronUp';
import {
  useAndroid,
  useAppBar,
  useChangeTheme,
  useLanguage,
  useLogout,
  useSupport,
} from './AppBar.hooks';
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
import Input from './ui/Input';
import useLoad from '../hooks/useLoad';
import Textarea from './ui/Textarea';
import ChartLineIcon from './icons/ChartLine';
import NotebookIcon from './icons/Notebook';
import TranslateVariantIcon from './icons/TranslateVariant';
import SettingsIcon from './icons/Settings';
import TrashIcon from './icons/Trash';
import SupportIcon from './icons/Support';
import InformationIcon from './icons/Information';
import LoginIcon from './icons/Login';
import LogoutIcon from './icons/Logout';
import CloseOctagonIcon from './icons/CloseOctagon';
import AdminIcon from './icons/Admin';

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
  const { load, setLoad } = useLoad();
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

  const {
    onClickSupport,
    onKeyDownOpenSupportDialog,
    supportDialog,
    setSupportDialog,
    onClickCancelSupport,
    onClickOpenSupportDialog,
    onChangeSupportSubject,
    onBlurSupportSubject,
    supportSubject,
    supportSubjectError,
    supportText,
    changeSupportText,
    supportTextRows,
    supportTextError,
  } = useSupport({ user, setLoad, locale: locale.support });

  const linkStyle: React.CSSProperties =
    menuOpen && isMobile
      ? {
          color: 'transparent',
          textShadow: `0 0 8px ${theme.text}`,
          transition: `all ${MENU_TRANSITION / 1000}s ease-out`,
        }
      : { color: theme.text, transition: `all ${MENU_TRANSITION / 1000}s ease-in` };

  const { android, closeApp } = useAndroid();

  const { locales, language, onChangeLang } = useLanguage({ user });

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
          boxShadow: full ? `0px 1px 5px   ${theme.active}` : 'none',
        }}
      >
        {full && (
          <div className={s.links}>
            <div className={s.items}>
              {!checkRouterPath(router.asPath, Pages.translate) ? (
                <Link noWrap theme={theme} href={Pages.translate} className={s.item}>
                  <div className={s.menu__item}>
                    <div style={linkStyle}>{locale.translate}</div>
                  </div>
                </Link>
              ) : (
                <div className={clsx(s.menu__item, s.item)}>
                  <div style={linkStyle}>{locale.translate}</div>
                </div>
              )}
              {!checkRouterPath(router.asPath, Pages.myDictionary) && user ? (
                <Link noWrap theme={theme} href={Pages.myDictionary} className={s.item}>
                  <div className={s.menu__item}>
                    <div style={linkStyle}>{locale.myDictionary}</div>
                  </div>
                </Link>
              ) : (
                user && (
                  <div className={clsx(s.menu__item, s.item)}>
                    <div style={linkStyle}>{locale.myDictionary}</div>
                  </div>
                )
              )}
            </div>
            {typeof isMobile === 'boolean' && !isMobile && (
              <div className={s.actions}>
                <div className={s.translate_icon}>
                  <TranslateIcon withoutScale color={theme.text} />
                </div>
                <Select
                  viceVersa
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
          {!checkRouterPath(router.asPath, Pages.translate) ? (
            <Link withoutHover fullWidth theme={theme} href={Pages.translate}>
              <div className={clsx(s.menu__item, s.active)}>
                <TranslateVariantIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.translate}</div>
              </div>
            </Link>
          ) : (
            <div className={clsx(s.menu__item, s.active, s.disabled)}>
              <TranslateVariantIcon color={theme.text} withoutScale />
              <div style={{ color: theme.text }}>{locale.translate}</div>
            </div>
          )}
          {!checkRouterPath(router.asPath, Pages.myDictionary) && user ? (
            <Link withoutHover fullWidth theme={theme} href={Pages.myDictionary}>
              <div className={clsx(s.menu__item, s.active)}>
                <NotebookIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.myDictionary}</div>
              </div>
            </Link>
          ) : (
            user && (
              <div className={clsx(s.menu__item, s.active, s.disabled)}>
                <NotebookIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.myDictionary}</div>
              </div>
            )
          )}
          {!checkRouterPath(router.asPath, Pages.statistics) && user ? (
            <Link withoutHover fullWidth theme={theme} href={Pages.statistics}>
              <div className={clsx(s.menu__item, s.active)}>
                <ChartLineIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.statistics}</div>
              </div>
            </Link>
          ) : (
            user && (
              <div className={clsx(s.menu__item, s.active, s.disabled)}>
                <ChartLineIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.statistics}</div>
              </div>
            )
          )}
          {!checkRouterPath(router.asPath, Pages.trash) && user ? (
            <Link withoutHover fullWidth theme={theme} href={Pages.trash}>
              <div className={clsx(s.menu__item, s.active)}>
                <TrashIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.trash}</div>
              </div>
            </Link>
          ) : (
            user && (
              <div className={clsx(s.menu__item, s.active, s.disabled)}>
                <TrashIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.trash}</div>
              </div>
            )
          )}
          {user && <Hr theme={theme} />}
          <div className={clsx(s.menu__item)}>
            <div style={{ color: theme.text }}>{locale.darkTheme}</div>
            <Switch on={darkTheme} onClick={onClickChangeTheme} theme={theme} />
          </div>
          {(isMobile || !full) && (
            <div className={s.menu__item}>
              <TranslateIcon color={theme.text} withoutScale />
              <Select ref={localeRef} onChange={onChangeLang} active theme={theme} value={language}>
                {(locales as LocaleValue[])?.map((item) => (
                  <option value={item} key={item}>
                    {LOCALE_NAMES[item]}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {!checkRouterPath(router.asPath, [Pages.settings]) ? (
            <Link withoutHover fullWidth theme={theme} href={Pages.settings}>
              <div className={clsx(s.menu__item, s.active)}>
                <SettingsIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.settings}</div>
              </div>
            </Link>
          ) : (
            <div className={clsx(s.menu__item, s.active, s.disabled)}>
              <SettingsIcon color={theme.text} withoutScale />
              <div style={{ color: theme.text }}>{locale.settings}</div>
            </div>
          )}
          <Hr theme={theme} />
          {user && (
            <div
              role="button"
              onKeyDown={onKeyDownOpenSupportDialog}
              tabIndex={-2}
              onClick={onClickOpenSupportDialog}
              className={clsx(l.wrapper, l.full__width, l.without__hover)}
            >
              <div className={clsx(s.menu__item, s.active)}>
                <SupportIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.support.title}</div>
              </div>
            </div>
          )}
          <div className={s.bottom}>
            {!checkRouterPath(router.asPath, [Pages.admin]) && user && user.role === 'admin' ? (
              <Link withoutHover fullWidth theme={theme} href={Pages.admin}>
                <div className={clsx(s.menu__item, s.active)}>
                  <AdminIcon color={theme.text} withoutScale />
                  <div style={{ color: theme.text }}>{locale.adminArea}</div>
                </div>
              </Link>
            ) : (
              user &&
              user.role === 'admin' && (
                <div className={clsx(s.menu__item, s.active, s.disabled)}>
                  <AdminIcon color={theme.text} withoutScale />
                  <div style={{ color: theme.text }}>{locale.adminArea}</div>
                </div>
              )
            )}
            {!checkRouterPath(router.asPath, [Pages.about]) ? (
              <Link withoutHover fullWidth theme={theme} href={Pages.about}>
                <div className={clsx(s.menu__item, s.active)}>
                  <InformationIcon color={theme.text} withoutScale />
                  <div style={{ color: theme.text }}>{locale.about}</div>
                </div>
              </Link>
            ) : (
              <div className={clsx(s.menu__item, s.active, s.disabled)}>
                <InformationIcon color={theme.text} withoutScale />
                <div style={{ color: theme.text }}>{locale.about}</div>
              </div>
            )}
            {!checkRouterPath(router.asPath, [Pages.signIn, Pages.signUp]) && !user ? (
              <Link
                withoutHover
                fullWidth
                theme={theme}
                href={`${PAGE_LOGIN_IN_MENU}?r=${router.pathname}`}
              >
                <div className={clsx(s.menu__item, s.active)}>
                  <LoginIcon color={theme.text} withoutScale />
                  <div style={{ color: theme.text }}>{locale.login}</div>
                </div>
              </Link>
            ) : (
              !user && (
                <div className={clsx(s.menu__item, s.active, s.disabled)}>
                  <LoginIcon color={theme.text} withoutScale />
                  <div style={{ color: theme.text }}>{locale.login}</div>
                </div>
              )
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
                  <LogoutIcon color={theme.text} withoutScale />
                  <div style={{ color: theme.text }}>{locale.logout}</div>
                </div>
              </div>
            )}
            {android && (
              <Link onClick={closeApp} withoutHover fullWidth theme={theme} href="?">
                <div className={clsx(s.menu__item, s.active)}>
                  <CloseOctagonIcon color={theme.text} withoutScale />
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
          <ChevronUpIcon color={theme.text} />
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
      {user && (
        <Dialog className={p.dialog} theme={theme} onClose={setSupportDialog} open={supportDialog}>
          <div className={p.dialog__content}>
            <Typography variant="h3" theme={theme} align="center">
              {locale.support.title}
            </Typography>
            {!user?.confirm && (
              <>
                <Typography variant="p" theme={theme} styleName="warn">
                  {locale.support.warning}
                </Typography>
                <Link href={Pages.settings} theme={theme}>
                  {locale.settings}
                </Link>
              </>
            )}
            <Input
              theme={theme}
              onChange={onChangeSupportSubject}
              onBlur={onBlurSupportSubject}
              value={supportSubject}
              id="subject"
              type="text"
              required
              error={supportSubjectError}
              disabled={load || !user?.confirm}
              name={locale.support.subject}
              fullWidth
              maxLength={SUPPORT_SUBJECT_MAX_LENGTH}
              desc={`${supportSubject.length}/${SUPPORT_SUBJECT_MAX_LENGTH}`}
            />
            <Textarea
              placeholder={locale.support.text}
              value={supportText}
              spellCheck
              onInput={changeSupportText}
              rows={supportTextRows}
              theme={theme}
              disabled={load || !user?.confirm}
              maxLength={SUPPORT_TEXT_MAX_LENGHT}
              error={supportTextError}
            />
          </div>
          <div className={p.dialog__actions}>
            <Button className={s.button} onClick={onClickCancelSupport} theme={theme}>
              {locale.cancel}
            </Button>
            <div className={p.button_margin} />
            <Button
              disabled={
                load || !user?.confirm || supportText.length === 0 || supportSubjectError !== ''
              }
              className={s.button}
              onClick={onClickSupport}
              theme={theme}
            >
              {locale.send}
            </Button>
          </div>
        </Dialog>
      )}
    </header>
  );
}

AppBar.defaultProps = {
  withoutExpandLess: false,
  full: false,
};

export default AppBar;
