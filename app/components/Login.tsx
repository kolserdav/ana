import useLoad from '@/hooks/useLoad';
import { Theme } from '@/Theme';
import { Locale } from '@/types/interfaces';
import { useEmailInput } from './Login.hooks';
import s from './Login.module.scss';
import Button from './ui/Button';
import Input from './ui/Input';

function Login({ theme, locale }: { theme: Theme; locale: Locale['app']['login'] }) {
  const { load, setLoad } = useLoad();

  const { email, emailDisabled, emailError, emailSuccess, onChangeEmail, onBlurEmail } =
    useEmailInput();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
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
        />
        <Button
          load={load}
          theme={theme}
          onClick={() => {
            /** */
          }}
        >
          test
        </Button>
      </div>
    </div>
  );
}

export default Login;
