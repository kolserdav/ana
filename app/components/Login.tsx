import useLoad from '@/hooks/useLoad';
import { Theme } from '@/Theme';
import { Locale } from '@/types/interfaces';
import {
  useEmailInput,
  useLoginInput,
  usePasswordInput,
  usePasswordRepeatInput,
  useTabs,
} from './Login.hooks';
import s from './Login.module.scss';
import Button from './ui/Button';
import Input from './ui/Input';
import Tabs from './ui/Tabs';
import Typography from './ui/Typography';

function Login({ theme, locale }: { theme: Theme; locale: Locale['app']['login'] }) {
  const { load, setLoad } = useLoad();

  const { login, loginError, loginSuccess, onChangeLogin, onBlurLogin } = useLoginInput();

  const { email, emailError, emailSuccess, onChangeEmail, onBlurEmail } = useEmailInput();

  const { password, passwordError, passwordSuccess, onChangePassword, onBlurPassword } =
    usePasswordInput();

  const {
    passwordRepeat,
    passwordRepeatError,
    passwordRepeatSuccess,
    onChangePasswordRepeat,
    onBlurPasswordRepeat,
  } = usePasswordRepeatInput();

  const { tabActive, onClickTab } = useTabs();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography center theme={theme} variant="h1">
          {locale.signIn}
        </Typography>
        <Typography theme={theme} variant="p">
          {locale.formDesc}
        </Typography>
        <form>
          <Input
            theme={theme}
            onChange={onChangeLogin}
            onBlur={onBlurLogin}
            value={login}
            id="login"
            type="login"
            required
            colorActive
            error={loginError}
            success={loginSuccess}
            disabled={load}
            load={load}
            name={`${locale.login}*`}
            fullWidth
          />
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
            load={load}
            name={`${locale.email}*`}
            fullWidth
          />
          <Tabs
            label={`${locale.accountType}*`}
            theme={theme}
            active={tabActive}
            tabs={locale.tabs}
            onClick={onClickTab}
            tabDefault={locale.tabDefault}
          />
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
            load={load}
            name={`${locale.password}*`}
            fullWidth
          />
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
            load={load}
            name={`${locale.paswordRepeat}*`}
            fullWidth
          />
          <div className={s.actives}>
            <Button
              load={load}
              theme={theme}
              onClick={() => {
                /** */
              }}
            >
              {locale.loginButton}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
