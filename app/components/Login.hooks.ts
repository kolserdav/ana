import { checkEmail } from '@/types/interfaces';
import { EMAIL_MAX_LENGTH } from '@/utils/constants';
import React, { useState } from 'react';

export const useEmailInput = () => {
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailDisabled, setEmailDisabled] = useState<boolean>(false);
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
    emailDisabled,
    emailError,
    emailSuccess,
  };
};

export const useLoginInput = () => {
  const [loginError, setLoginError] = useState<boolean>(false);
  const [loginDisabled, setLoginDisabled] = useState<boolean>(false);
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
    loginDisabled,
    loginError,
    loginSuccess,
  };
};

export const useTabs = () => {
  const [tabActive, setTabActive] = useState<number>(0);

  const onClickTab = (id: number) => {
    setTabActive(id);
  };

  return { tabActive, onClickTab };
};
