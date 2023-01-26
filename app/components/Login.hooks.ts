import { checkEmail } from '@/types/interfaces';
import { EMAIL_MAX_LENGTH, TAB_INDEX_DEFAULT } from '@/utils/constants';
import React, { useState } from 'react';

export const useEmailInput = () => {
  const [emailError, setEmailError] = useState<boolean>(false);
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
        setEmailError(!check);
      }
      setEmail(value);
    }
  };

  const onBlurEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (email) {
      setEmailError(!checkEmail(email));
    } else {
      setEmailError(false);
    }
  };

  return {
    onChangeEmail,
    onBlurEmail,
    email,
    emailError,
    emailSuccess,
  };
};

export const useLoginInput = () => {
  const [loginError, setLoginError] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');

  const onChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < EMAIL_MAX_LENGTH) {
      const check = checkEmail(value);
      setLoginSuccess(check);
      if (loginError) {
        setLoginError(!check);
      }
      setLogin(value);
    }
  };

  const onBlurLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (login) {
      setLoginError(!checkEmail(login));
    } else {
      setLoginError(false);
    }
  };

  return {
    onChangeLogin,
    onBlurLogin,
    login,
    loginError,
    loginSuccess,
  };
};

export const usePasswordInput = () => {
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < EMAIL_MAX_LENGTH) {
      const check = checkEmail(value);
      setPasswordSuccess(check);
      if (passwordError) {
        setPasswordError(!check);
      }
      setPassword(value);
    }
  };

  const onBlurPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (password) {
      setPasswordError(!checkEmail(password));
    } else {
      setPasswordError(false);
    }
  };

  return {
    onChangePassword,
    onBlurPassword,
    password,
    passwordError,
    passwordSuccess,
  };
};

export const usePasswordRepeatInput = () => {
  const [passwordRepeatError, setPasswordRepeatError] = useState<boolean>(false);
  const [passwordRepeatSuccess, setPasswordRepeatSuccess] = useState<boolean>(false);
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');

  const onChangePasswordRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < EMAIL_MAX_LENGTH) {
      const check = checkEmail(value);
      setPasswordRepeatSuccess(check);
      if (passwordRepeatError) {
        setPasswordRepeatError(!check);
      }
      setPasswordRepeat(value);
    }
  };

  const onBlurPasswordRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordRepeat) {
      setPasswordRepeatError(!checkEmail(passwordRepeat));
    } else {
      setPasswordRepeatError(false);
    }
  };

  return {
    onChangePasswordRepeat,
    onBlurPasswordRepeat,
    passwordRepeat,
    passwordRepeatError,
    passwordRepeatSuccess,
  };
};

export const useTabs = () => {
  const [tabActive, setTabActive] = useState<number>(TAB_INDEX_DEFAULT);

  const onClickTab = (id: number) => {
    setTabActive(id);
  };

  return { tabActive, onClickTab };
};
