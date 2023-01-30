import { checkEmail } from '@/types/interfaces';
import { EMAIL_MAX_LENGTH, TAB_INDEX_DEFAULT } from '@/utils/constants';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { checkSignUp } from './Login.lib';

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

export const useNameInput = () => {
  const [nameError, setNameError] = useState<boolean>(false);
  const [nameSuccess, setNameSuccess] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < EMAIL_MAX_LENGTH) {
      const check = checkEmail(value);
      setNameSuccess(check);
      if (nameError) {
        setNameError(!check);
      }
      setName(value);
    }
  };

  const onBlurName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (name) {
      setNameError(!checkEmail(name));
    } else {
      setNameError(false);
    }
  };

  return {
    onChangeName,
    onBlurName,
    name,
    nameError,
    nameSuccess,
  };
};

export const useSurNameInput = () => {
  const [surnameError, setSurnameError] = useState<boolean>(false);
  const [surnameSuccess, setSurnameSuccess] = useState<boolean>(false);
  const [surname, setSurname] = useState<string>('');

  const onChangeSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < EMAIL_MAX_LENGTH) {
      const check = checkEmail(value);
      setSurnameSuccess(check);
      if (surnameError) {
        setSurnameError(!check);
      }
      setSurname(value);
    }
  };

  const onBlurSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (surname) {
      setSurnameError(!checkEmail(surname));
    } else {
      setSurnameError(false);
    }
  };

  return {
    onChangeSurname,
    onBlurSurname,
    surname,
    surnameError,
    surnameSuccess,
  };
};

export const useLoginOrEmailInput = () => {
  const [loginOrEmailError, setLoginOrEmailError] = useState<boolean>(false);
  const [loginOrEmailSuccess, setLoginOrEmailSuccess] = useState<boolean>(false);
  const [loginOrEmail, setLoginOrEmail] = useState<string>('');

  const onChangeLoginOrEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < EMAIL_MAX_LENGTH) {
      const check = checkEmail(value);
      setLoginOrEmailSuccess(check);
      if (loginOrEmailError) {
        setLoginOrEmailError(!check);
      }
      setLoginOrEmail(value);
    }
  };

  const onBlurLoginOrEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loginOrEmail) {
      setLoginOrEmailError(!checkEmail(loginOrEmail));
    } else {
      setLoginOrEmailError(false);
    }
  };

  return {
    onChangeLoginOrEmail,
    onBlurLoginOrEmail,
    loginOrEmail,
    loginOrEmailError,
    loginOrEmailSuccess,
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

export const useCheckPage = () => {
  const router = useRouter();

  const isSignUp = checkSignUp(router.asPath);

  return { isSignUp };
};
