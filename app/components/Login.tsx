import { Theme } from '@/Theme';
import { useInputs } from './Login.hooks';
import s from './Login.module.scss';
import Input from './ui/Input';

function Login({ theme }: { theme: Theme }) {
  const { email, emailDisabled, emailError, emailSuccess, onChangeEmail, load, onBlurEmail } =
    useInputs();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Input
          theme={theme}
          onChange={onChangeEmail}
          onBlur={onBlurEmail}
          value={email}
          id="email"
          error={emailError}
          success={emailSuccess}
          disabled={emailDisabled}
          load={load}
          name="Email"
        />
      </div>
    </div>
  );
}

export default Login;
