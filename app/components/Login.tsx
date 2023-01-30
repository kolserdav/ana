import useConnId from '@/hooks/useConnId';
import useLoad from '@/hooks/useLoad';
import { Theme } from '@/Theme';
import { Locale } from '@/types/interfaces';
import { TAB_INDEX_DEFAULT } from '@/utils/constants';
import {
  useCheckPage,
  useEmailInput,
  useNameInput,
  usePasswordInput,
  useTabs,
  useSurNameInput,
  useMessages,
  useButton,
} from './Login.hooks';
import s from './Login.module.scss';
import Button from './ui/Button';
import Input from './ui/Input';
import Link from './ui/Link';
import Tabs from './ui/Tabs';
import Typography from './ui/Typography';

function Login({ theme, locale }: { theme: Theme; locale: Locale['app']['login'] }) {
  const { setConnId, connId } = useConnId();

  const { load, setLoad } = useLoad();

  const { isSignUp } = useCheckPage();

  const { name, nameError, onChangeName, onBlurName, setNameError } = useNameInput({ locale });

  const { surname, surnameError, onChangeSurname, onBlurSurname, setSurnameError } =
    useSurNameInput({ locale });

  const { email, emailError, emailSuccess, onChangeEmail, onBlurEmail, setEmailError } =
    useEmailInput({ locale });

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
  } = usePasswordInput({ locale, isSignUp });

  const { tabActive, onClickTab } = useTabs();

  useMessages({ setConnId });

  const disabled = tabActive === TAB_INDEX_DEFAULT && isSignUp;

  const { onClickLoginButton, onClickRegisterButton } = useButton({
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
  });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography center theme={theme} variant="h1">
          {isSignUp ? locale.signUp : locale.signIn}
        </Typography>
        <Typography theme={theme} variant="p">
          {locale.formDesc}
        </Typography>
        <form>
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
          {isSignUp && (
            <Tabs
              label={`${locale.accountType}*`}
              theme={theme}
              active={tabActive}
              tabs={locale.tabs}
              onClick={onClickTab}
              tabDefault={locale.tabDefault}
            />
          )}
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
            name={`${locale.password}*`}
            fullWidth
          />
          {isSignUp && (
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
              disabled={disabled}
              load={load}
              theme={theme}
              onClick={isSignUp ? onClickRegisterButton : onClickLoginButton}
            >
              {locale.loginButton}
            </Button>
          </div>
        </form>
        <div className={s.link}>
          <Link theme={theme} href={isSignUp ? '/account/sign-in' : '/account/sign-up'}>
            {isSignUp ? locale.signIn : locale.signUp}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
