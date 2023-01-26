import useLoad from '@/hooks/useLoad';
import { Theme } from '@/Theme';
import { Locale } from '@/types/interfaces';
import { useEmailInput, useLoginInput, useTabs } from './Login.hooks';
import s from './Login.module.scss';
import Button from './ui/Button';
import Input from './ui/Input';
import Tabs from './ui/Tabs';

function Login({ theme, locale }: { theme: Theme; locale: Locale['app']['login'] }) {
  const { load, setLoad } = useLoad();

  const { login, loginDisabled, loginError, loginSuccess, onChangeLogin, onBlurLogin } =
    useLoginInput();

  const { email, emailDisabled, emailError, emailSuccess, onChangeEmail, onBlurEmail } =
    useEmailInput();

  const { tabActive, onClickTab } = useTabs();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Input
          theme={theme}
          onChange={onChangeLogin}
          onBlur={onBlurLogin}
          value={login}
          id="login"
          type="login"
          error={loginError}
          success={loginSuccess}
          disabled={loginDisabled}
          load={load}
          name={locale.login}
          fullWidth
        />
        <Input
          theme={theme}
          onChange={onChangeEmail}
          onBlur={onBlurEmail}
          value={email}
          id="email"
          type="email"
          error={emailError}
          success={emailSuccess}
          disabled={emailDisabled}
          load={load}
          name={locale.email}
          fullWidth
        />
        <Tabs theme={theme} active={tabActive} tabs={locale.tabs} onClick={onClickTab} />
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
      </div>
    </div>
  );
}

export default Login;
