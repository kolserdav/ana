import { checkEmail, Locale, MessageType } from '@/types/interfaces';
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  SURNAME_MAX_LENGTH,
  TAB_INDEX_DEFAULT,
} from '@/utils/constants';
import { log } from '@/utils/lib';
import Request from '@/utils/request';
import WS from '@/utils/ws';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  checkSignUp,
  checkName,
  checkOnlyLetters,
  checkOnlyNumbers,
  checkPassword,
} from './Login.lib';

export const useEmailInput = ({ locale }: { locale: Locale['app']['login'] }) => {
  const [emailError, setEmailError] = useState<string>('');
  const [emailSuccess, setEmailSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < EMAIL_MAX_LENGTH) {
      const check = checkEmail(value);
      setEmailSuccess(check);
      if (emailError) {
        setEmailError('');
      }
      setEmail(value);
    }
  };

  const onBlurEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (email) {
      setEmailError(!checkEmail(email) ? locale.emailIsUnacceptable : '');
    } else {
      setEmailError('');
    }
  };

  return {
    onChangeEmail,
    onBlurEmail,
    email,
    emailError,
    setEmailError,
    emailSuccess,
  };
};

export const useNameInput = ({ locale }: { locale: Locale['app']['login'] }) => {
  const [nameError, setNameError] = useState<string>('');
  const [name, setName] = useState<string>('');

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < NAME_MAX_LENGTH) {
      setName(value);
      if (nameError && checkName(value)) {
        setNameError('');
      }
    }
  };

  const onBlurName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (name) {
      setNameError(!checkName(name) ? locale.fieldProhibited : '');
    } else {
      setNameError('');
    }
  };

  return {
    onChangeName,
    onBlurName,
    name,
    nameError,
    setNameError,
  };
};

export const useSurNameInput = ({ locale }: { locale: Locale['app']['login'] }) => {
  const [surnameError, setSurnameError] = useState<string>('');
  const [surname, setSurname] = useState<string>('');

  const onChangeSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < SURNAME_MAX_LENGTH) {
      setSurname(value);
      if (surnameError && checkName(value)) {
        setSurnameError('');
      }
    }
  };

  const onBlurSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (surname) {
      setSurnameError(!checkName(surname) ? locale.fieldProhibited : '');
    } else {
      setSurnameError('');
    }
  };

  return {
    onChangeSurname,
    onBlurSurname,
    surname,
    surnameError,
    setSurnameError,
  };
};

export const usePasswordInput = ({
  locale,
  isSignUp,
}: {
  locale: Locale['app']['login'];
  isSignUp: boolean;
}) => {
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordRepeatError, setPasswordRepeatError] = useState<string>('');
  const [passwordRepeatSuccess, setPasswordRepeatSuccess] = useState<boolean>(false);
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setPassword(value);
    if (passwordSuccess) {
      setPasswordSuccess(false);
    }
    if (
      passwordError &&
      checkPassword({ password, locale }) &&
      password.length >= PASSWORD_MIN_LENGTH
    ) {
      setPasswordError('');
    }
  };

  const onBlurPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(`${locale.passwordMinLengthIs}: ${PASSWORD_MIN_LENGTH}`);
    } else {
      const psErr = checkPassword({ password, locale });
      setPasswordError(psErr);
      if (psErr === '' && isSignUp && passwordRepeat && passwordRepeat !== password) {
        setPasswordRepeatError(locale.passwordsDoNotMatch);
      } else {
        setPasswordRepeatSuccess(true);
        setPasswordSuccess(true);
      }
    }
  };

  const onChangePasswordRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (passwordRepeatSuccess) {
      setPasswordRepeatSuccess(false);
    }
    setPasswordRepeat(value);
    if (
      passwordRepeatError &&
      checkPassword({ password: passwordRepeat, locale }) &&
      passwordRepeat.length >= PASSWORD_MIN_LENGTH
    ) {
      setPasswordRepeatError('');
    }
  };

  const onBlurPasswordRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordRepeat.length < PASSWORD_MIN_LENGTH) {
      setPasswordRepeatError(`${locale.passwordMinLengthIs}: ${PASSWORD_MIN_LENGTH}`);
    } else {
      const psErr = checkPassword({ password: passwordRepeat, locale });
      setPasswordRepeatError(psErr);
      if (psErr === '' && isSignUp && password && passwordRepeat !== password) {
        setPasswordRepeatError(locale.passwordsDoNotMatch);
      } else {
        setPasswordRepeatSuccess(true);
        setPasswordSuccess(true);
      }
    }
  };

  return {
    onChangePassword,
    onBlurPassword,
    password,
    passwordError,
    passwordSuccess,
    onChangePasswordRepeat,
    onBlurPasswordRepeat,
    passwordRepeat,
    passwordRepeatError,
    passwordRepeatSuccess,
    setPasswordError,
    setPasswordRepeatError,
  };
};

export const useTabs = () => {
  const [tabActive, setTabActive] = useState<number>(TAB_INDEX_DEFAULT);

  const onClickTab = (id: number) => {
    setTabActive(id);
  };

  return { tabActive, onClickTab };
};

export const useCheckPage = () => {
  const router = useRouter();

  const isSignUp = checkSignUp(router.asPath);

  return { isSignUp };
};

export const useMessages = ({
  setConnId,
}: {
  setConnId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const ws = useMemo(() => new WS({ protocol: 'login' }), []);

  /**
   * Connect to WS
   */
  useEffect(() => {
    if (!ws.connection) {
      return;
    }
    ws.connection.onmessage = (msg) => {
      const { data } = msg;
      const rawMessage = ws.parseMessage(data);
      if (!rawMessage) {
        return;
      }
      const { type, id } = rawMessage;
      switch (type) {
        case MessageType.SET_CONNECTION_ID:
          setConnId(id);
          break;
        case MessageType.SET_USER_CREATE:
          console.log(rawMessage);
          break;
        default:
          log('warn', 'Not implemented on ws message case in login', rawMessage);
      }
    };
  }, [ws, setConnId]);
};

export const useButton = ({
  name,
  nameError,
  surname,
  surnameError,
  email,
  emailError,
  password,
  passwordError,
  passwordRepeat,
  passwordRepeatError,
  locale,
  setNameError,
  setSurnameError,
  setEmailError,
  setPasswordError,
  setPasswordRepeatError,
}: {
  name: string;
  nameError: string;
  surname: string;
  surnameError: string;
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  passwordRepeat: string;
  passwordRepeatError: string;
  locale: Locale['app']['login'];
  setNameError: React.Dispatch<React.SetStateAction<string>>;
  setSurnameError: React.Dispatch<React.SetStateAction<string>>;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordRepeatError: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const checkLoginFields = () => {
    let error = false;
    if (!email || emailError) {
      error = true;
      setEmailError(locale.fieldMustBeNotEmpty);
    }
    if (!password || passwordError) {
      error = true;
      setPasswordError(locale.fieldMustBeNotEmpty);
    }
    return error;
  };

  const checkRegisterFields = () => {
    let error = false;
    if (!name || nameError) {
      setNameError(locale.fieldMustBeNotEmpty);
      error = true;
    }
    if (!surname || surnameError) {
      setSurnameError(locale.fieldMustBeNotEmpty);
      error = true;
    }
    if (!email || emailError) {
      error = true;
      setEmailError(locale.fieldMustBeNotEmpty);
    }
    if (!password || passwordError) {
      setPasswordError(locale.fieldMustBeNotEmpty);
      error = true;
    }
    if (!passwordRepeat || passwordRepeatError) {
      setPasswordRepeatError(locale.fieldMustBeNotEmpty);
      error = true;
    }
    return error;
  };

  const onClickLoginButton = () => {
    const error = checkLoginFields();
  };

  const onClickRegisterButton = () => {
    const error = checkRegisterFields();

    //
  };
  return { onClickLoginButton, onClickRegisterButton };
};
