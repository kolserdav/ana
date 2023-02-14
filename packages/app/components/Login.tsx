import useChangeLocation from '../hooks/useChangeLocation';
import useConnId from '../hooks/useConnId';
import useLoad from '../hooks/useLoad';
import useWS from '../hooks/useWS';
import { Theme } from '../Theme';
import { Locale } from '../types/interfaces';
import { LOAD_PAGE_DURATION, Pages, TAB_INDEX_DEFAULT } from '../utils/constants';
import {
  useCheckPage,
  useEmailInput,
  useNameInput,
  usePasswordInput,
  useTabs,
  useSurnameInput,
  useMessages,
  useButton,
  useClean,
  useErrorDialog,
} from './Login.hooks';
import s from './Login.module.scss';
import Button from './ui/Button';
import Card from './ui/Card';
import Dialog from './ui/Dialog';
import Input from './ui/Input';
import Link from './ui/Link';
import Tabs from './ui/Tabs';
import Typography from './ui/Typography';

function Login({
  theme,
  locale,
  formDesc,
}: {
  theme: Theme;
  locale: Locale['app']['login'];
  formDesc: string;
}) {
  const { ws } = useWS({ protocol: 'login' });

  const { setConnId, connId } = useConnId();

  const { load, setLoad } = useLoad();

  const { isSignUp, isRestore, isChangePass } = useCheckPage();

  const { name, nameError, onChangeName, onBlurName, setNameError, setName } = useNameInput({
    locale,
  });

  const { surname, surnameError, onChangeSurname, onBlurSurname, setSurnameError, setSurname } =
    useSurnameInput({ locale });

  const {
    email,
    emailError,
    emailSuccess,
    onChangeEmail,
    onBlurEmail,
    setEmailError,
    setEmail,
    setEmailSuccess,
  } = useEmailInput({ locale, connId, ws });

  const {
    password,
    passwordError,
    passwordSuccess,
    onChangePassword,
    onBlurPassword,
    onChangePasswordRepeat,
    onBlurPasswordRepeat,
    passwordRepeat,
    passwordRepeatError,
    passwordRepeatSuccess,
    setPasswordError,
    setPasswordRepeatError,
    setPassword,
    setPasswordRepeat,
    setPasswordRepeatSuccess,
    setPasswordSuccess,
  } = usePasswordInput({ locale, isSignUp: isSignUp || isChangePass });

  const { tabActive, onClickTab, setTabsError, tabsError, setTabActive } = useTabs();

  const { cleanAllFields } = useClean({
    setEmail,
    setEmailError,
    setName,
    setNameError,
    setPassword,
    setPasswordError,
    setPasswordRepeat,
    setPasswordRepeatError,
    setSurname,
    setSurnameError,
    setTabActive,
    setTabsError,
    setEmailSuccess,
    setPasswordRepeatSuccess,
    setPasswordSuccess,
  });

  const tabSelected = tabActive !== TAB_INDEX_DEFAULT && isSignUp;

  const { errorDialogOpen, setErrorDialogOpen } = useErrorDialog();

  const {
    onClickLoginButton,
    onClickRegisterButton,
    buttonError,
    setButtonError,
    onClickRestoreButton,
    onClickChangePasswordButton,
    setPageError,
    pageError,
  } = useButton({
    locale,
    name,
    nameError,
    surname,
    surnameError,
    setEmailError,
    setNameError,
    setPasswordError,
    setPasswordRepeatError,
    setSurnameError,
    password,
    passwordError,
    passwordRepeat,
    passwordRepeatError,
    email,
    emailError,
    tabSelected,
    setTabsError,
    tabActive,
    ws,
    connId,
    setLoad,
    setErrorDialogOpen,
    setEmail,
  });

  useChangeLocation(() => {
    setLoad(true);
    setTimeout(() => setLoad(false), LOAD_PAGE_DURATION);
    cleanAllFields();
    setPageError('');
  });

  useMessages({
    setConnId,
    ws,
    setEmailError,
    locale,
    isSignUp,
    email,
    password,
    cleanAllFields,
    setLoad,
    setEmailSuccess,
    setButtonError,
    setPageError,
    onClickLoginButton,
  });

  return (
    <div className={s.wrapper}>
      <Typography align="center" theme={theme} variant="h1">
        {isSignUp
          ? locale.signUp
          : isRestore
          ? locale.restorePassword
          : isChangePass
          ? locale.changePassword
          : locale.signIn}
      </Typography>
      <div className={s.container}>
        {isRestore && (
          <div className={s.restore__desc}>
            <Card theme={theme}>
              <Typography align="justify" theme={theme} variant="p">
                {locale.restoreDesc}
              </Typography>
            </Card>
          </div>
        )}
        <form>
          <Typography theme={theme} small variant="p">
            {formDesc}
          </Typography>
          {isSignUp && (
            <Input
              theme={theme}
              onChange={onChangeName}
              onBlur={onBlurName}
              value={name}
              id="name"
              type="text"
              required
              error={nameError}
              disabled={load}
              name={`${locale.name}*`}
              fullWidth
            />
          )}
          {isSignUp && (
            <Input
              theme={theme}
              onChange={onChangeSurname}
              onBlur={onBlurSurname}
              value={surname}
              id="surname"
              type="text"
              required
              error={surnameError}
              disabled={load}
              name={`${locale.surname}*`}
              fullWidth
            />
          )}
          {!isChangePass && (
            <Input
              theme={theme}
              onChange={onChangeEmail}
              onBlur={onBlurEmail}
              value={email}
              id="email"
              type="email"
              required
              colorActive
              error={emailError}
              success={emailSuccess}
              disabled={load}
              name={`${locale.email}*`}
              fullWidth
            />
          )}
          {isSignUp && (
            <Tabs
              label={`${locale.accountType}*`}
              theme={theme}
              active={tabActive}
              disabled={load}
              tabs={locale.tabs}
              onClick={onClickTab}
              tabDefault={locale.tabDefault}
              error={tabsError}
            />
          )}
          {!isRestore && (
            <Input
              theme={theme}
              onChange={onChangePassword}
              onBlur={onBlurPassword}
              value={password}
              id="password"
              type="password"
              required
              colorActive
              error={passwordError}
              success={passwordSuccess}
              disabled={load}
              name={`${isChangePass ? locale.newPassword : locale.password}*`}
              fullWidth
            />
          )}
          {(isSignUp || isChangePass) && (
            <Input
              theme={theme}
              onChange={onChangePasswordRepeat}
              onBlur={onBlurPasswordRepeat}
              value={passwordRepeat}
              id="password-repeat"
              type="password"
              required
              colorActive
              error={passwordRepeatError}
              success={passwordRepeatSuccess}
              disabled={load}
              name={`${locale.passwordRepeat}*`}
              fullWidth
            />
          )}
          <div className={s.actives}>
            <Button
              error={buttonError}
              disabled={load}
              theme={theme}
              onClick={
                isSignUp
                  ? onClickRegisterButton
                  : isRestore
                  ? onClickRestoreButton
                  : isChangePass
                  ? onClickChangePasswordButton
                  : onClickLoginButton
              }
            >
              {isSignUp
                ? locale.register
                : isRestore
                ? locale.sendRestoreMail
                : isChangePass
                ? locale.save
                : locale.loginButton}
            </Button>
            {!isSignUp && !isRestore && !isChangePass && (
              <Link disabled={load} theme={theme} href={Pages.restorePassword}>
                {locale.forgotPassword}
              </Link>
            )}
          </div>
          {!isChangePass && (
            <div className={s.link}>
              <Link
                disabled={load}
                theme={theme}
                href={isSignUp || isRestore ? Pages.signIn : Pages.signUp}
              >
                {isSignUp || isRestore ? locale.signIn : locale.signUp}
              </Link>
            </div>
          )}
        </form>
      </div>
      <Dialog theme={theme} open={errorDialogOpen}>
        <Typography align="center" theme={theme} variant="h4">
          {pageError}
        </Typography>
        <Link theme={theme} href={Pages.restorePassword}>
          {locale.sendNewLetter}
        </Link>
      </Dialog>
    </div>
  );
}

export default Login;
