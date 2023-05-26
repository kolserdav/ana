import { useRouter } from 'next/router';
import storeUserRenew, { changeUserRenew } from '../store/userRenew';
import { Locale } from '../types/interfaces';
import { CookieName, setCookie } from '../utils/cookies';
import { log } from '../utils/lib';
import Request from '../utils/request';

const request = new Request();

const useLogin = ({
  email,
  emailError,
  password,
  passwordError,
  setEmailError,
  fieldMustBeNotEmpty,
  setButtonError,
  locale,
  setPasswordError,
  buttonError,
  eliminateRemarks,
  setLoad,
  setNeedClean,
  isSignUp,
}: {
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  buttonError: string;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setButtonError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  fieldMustBeNotEmpty: string;
  eliminateRemarks: string;
  locale: Locale['app']['login'];
  isSignUp: boolean;
  setNeedClean: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const checkLoginFields = () => {
    let error = false;
    if (!email || emailError) {
      error = true;
      if (!email) {
        setEmailError(fieldMustBeNotEmpty);
      }
    }
    if (!password || passwordError) {
      error = true;
      if (!password) {
        setPasswordError(fieldMustBeNotEmpty);
      }
    }
    setButtonError(error ? eliminateRemarks : '');
    return error;
  };

  const onClickLoginButton = async () => {
    const error = checkLoginFields();
    if (error) {
      return;
    }
    if (buttonError) {
      setButtonError('');
    }
    setLoad(true);
    const user = await request.userLogin({ email, password });
    setLoad(false);
    if (user.status !== 'info' || !user.data) {
      if (user.code === 401) {
        setPasswordError(user.message);
      }
      setButtonError(user.message);
      return;
    }
    setCookie(CookieName._utoken, user.data.token);
    setCookie(CookieName._uuid, user.data.userId);

    const { userRenew } = storeUserRenew.getState();
    storeUserRenew.dispatch(changeUserRenew({ userRenew: !userRenew }));
    log('info', locale.successLogin, { token: user.data.token }, !isSignUp);

    setNeedClean(true);
    setTimeout(() => {
      setNeedClean(false);
    }, 1000);
    router.push(`${router.asPath}#${new Date().getTime()}`);
  };

  return { onClickLoginButton };
};

export default useLogin;
