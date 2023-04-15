import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import useQueryString from '../hooks/useQueryString';
import storeUserRenew, { changeUserRenew } from '../store/userRenew';
import {
  checkEmail,
  Locale,
  PAGE_RESTORE_PASSWORD_CALLBACK,
  EMAIL_QS,
  KEY_QS,
  UserCleanResult,
} from '../types/interfaces';
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  Pages,
  PASSWORD_MIN_LENGTH,
  SURNAME_MAX_LENGTH,
  TAB_INDEX_DEFAULT,
} from '../utils/constants';
import { CookieName, setCookie } from '../utils/cookies';
import { checkRouterPath, log } from '../utils/lib';
import { checkName, checkPasswordError } from './Login.lib';
import Request from '../utils/request';

const request = new Request();

export const useEmailInput = ({
  locale,
  isSignUp,
}: {
  locale: Locale['app']['login'];
  isSignUp: boolean;
}) => {
  const [emailError, setEmailError] = useState<string>('');
  const [emailSuccess, setEmailSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailRegistered, setEmailRegistered] = useState<boolean>(false);

  const onChangeEmail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < EMAIL_MAX_LENGTH) {
      const check = checkEmail(value);
      if (check) {
        const checkRes = await request.checkEmail({ email });
        if (isSignUp && checkRes.data) {
          setEmailError(locale.emailIsRegistered);
          setEmailSuccess(false);
        } else if (!isSignUp && !checkRes.data) {
          setEmailError(locale.emailIsNotRegistered);
          setEmailSuccess(false);
        }
      }
      setEmailSuccess(check);
      if (emailError) {
        setEmailError('');
      }
      setEmail(value);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const onBlurEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (email) {
      const check = checkEmail(email);
      if (!check) {
        setEmailError(locale.emailIsUnacceptable);
      }
    }
  };

  return {
    onChangeEmail,
    onBlurEmail,
    email,
    emailError,
    setEmailError,
    emailSuccess,
    setEmail,
    setEmailSuccess,
    emailRegistered,
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

  // eslint-disable-next-line no-unused-vars
  const onBlurName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (name) {
      setNameError(!checkName(name) ? locale.fieldProhibited : '');
    } else {
      setNameError('');
    }
  };

  return {
    onChangeName,
    setName,
    onBlurName,
    name,
    nameError,
    setNameError,
  };
};

export const useSurnameInput = ({ locale }: { locale: Locale['app']['login'] }) => {
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

  // eslint-disable-next-line no-unused-vars
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
    setSurname,
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
      checkPasswordError({ password, locale }) === '' &&
      value.length >= PASSWORD_MIN_LENGTH
    ) {
      setPasswordError('');
    }
    if (
      passwordRepeat &&
      checkPasswordError({ password: passwordRepeat, locale }) === '' &&
      passwordRepeat.length >= PASSWORD_MIN_LENGTH &&
      value === passwordRepeat
    ) {
      setPasswordRepeatSuccess(true);
      setPasswordRepeatError('');
      setPasswordSuccess(true);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const onBlurPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (password) {
      if (password.length < PASSWORD_MIN_LENGTH) {
        setPasswordError(`${locale.passwordMinLengthIs}: ${PASSWORD_MIN_LENGTH}`);
      } else {
        const psErr = checkPasswordError({ password, locale });
        setPasswordError(psErr);
        if (psErr === '' && isSignUp && passwordRepeat && passwordRepeat !== password) {
          setPasswordRepeatError(locale.passwordsDoNotMatch);
        } else {
          setPasswordRepeatSuccess(true);
          setPasswordSuccess(true);
        }
      }
    } else {
      setPassword('');
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
    const psErr = checkPasswordError({ password: value, locale });
    if (passwordRepeatError && psErr === '' && value.length >= PASSWORD_MIN_LENGTH) {
      setPasswordRepeatError('');
    }
    if (
      password &&
      checkPasswordError({ password, locale }) === '' &&
      password.length >= PASSWORD_MIN_LENGTH &&
      password === value
    ) {
      setPasswordRepeatSuccess(true);
      setPasswordError('');
      setPasswordSuccess(true);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const onBlurPasswordRepeat = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordRepeat) {
      if (passwordRepeat.length < PASSWORD_MIN_LENGTH) {
        setPasswordRepeatError(`${locale.passwordMinLengthIs}: ${PASSWORD_MIN_LENGTH}`);
      } else {
        const psErr = checkPasswordError({ password: passwordRepeat, locale });
        setPasswordRepeatError(psErr);
        if (psErr === '' && isSignUp && password && passwordRepeat !== password) {
          setPasswordRepeatError(locale.passwordsDoNotMatch);
        } else {
          setPasswordRepeatSuccess(true);
          setPasswordSuccess(true);
        }
      }
    } else {
      setPasswordRepeatError('');
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
    setPassword,
    setPasswordRepeat,
    setPasswordSuccess,
    setPasswordRepeatSuccess,
  };
};

export const useTabs = () => {
  const [tabActive, setTabActive] = useState<number>(TAB_INDEX_DEFAULT);
  const [tabsError, setTabsError] = useState<string>('');

  const onClickTab = (id: number) => {
    setTabsError('');
    setTabActive(id);
  };

  return { tabActive, onClickTab, tabsError, setTabsError, setTabActive };
};

export const useCheckPage = () => {
  const router = useRouter();

  const isSignUp = checkRouterPath(router.asPath, Pages.signUp);
  const isRestore = checkRouterPath(router.asPath, Pages.restorePassword);
  const isChangePass = checkRouterPath(router.asPath, PAGE_RESTORE_PASSWORD_CALLBACK);

  return { isSignUp, isRestore, isChangePass };
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
  setTabsError,
  setSurnameError,
  setEmailError,
  setPasswordError,
  setPasswordRepeatError,
  setLoad,
  setErrorDialogOpen,
  tabSelected,
  setEmail,
  fieldMustBeNotEmpty,
  eliminateRemarks,
  isSignUp,
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
  setTabsError: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setSurnameError: React.Dispatch<React.SetStateAction<string>>;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordRepeatError: React.Dispatch<React.SetStateAction<string>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSignUp: boolean;
  tabSelected: boolean;
  fieldMustBeNotEmpty: string;
  eliminateRemarks: string;
}) => {
  const [buttonError, setButtonError] = useState<string>('');
  const [pageError, setPageError] = useState<string>('');
  const [needClean, setNeedClean] = useState<boolean>(false);

  const { e, k } = useQueryString<{ [EMAIL_QS]: string; [KEY_QS]: string }>();

  const checkRestoreFields = () => {
    let error = false;
    if (!email || emailError) {
      error = true;
      if (!email) {
        setEmailError(fieldMustBeNotEmpty);
      }
    }
    setButtonError(error ? eliminateRemarks : '');
    return error;
  };

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

  const checkChangePasswordFields = () => {
    let error = false;
    if (!password || passwordError) {
      error = true;
      if (!password) {
        setPasswordError(fieldMustBeNotEmpty);
      }
    }
    if (!passwordRepeat || passwordRepeatError) {
      if (!passwordRepeat) {
        setPasswordRepeatError(fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (!e || !k) {
      setPageError(locale.wrongParameters);
      error = true;
    }
    setButtonError(error ? eliminateRemarks : '');
    return error;
  };

  const checkRegisterFields = () => {
    let error = false;
    if (!tabSelected) {
      error = true;
      setTabsError(locale.neededSelect);
    }
    if (!name || nameError) {
      if (!name) {
        setNameError(fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (!surname || surnameError) {
      if (!surname) {
        setSurnameError(fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (!email || emailError) {
      error = true;
      if (!email) {
        setEmailError(fieldMustBeNotEmpty);
      }
    }
    if (!password || passwordError) {
      if (!password) {
        setPasswordError(fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (!passwordRepeat || passwordRepeatError) {
      if (!passwordRepeat) {
        setPasswordRepeatError(fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (passwordRepeat !== password) {
      setPasswordRepeatError(locale.passwordsDoNotMatch);
      error = true;
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
    if (user.status !== 'info' || !user.data) {
      if (user.code === 401) {
        setPasswordError(user.message);
      }
      setButtonError(user.message);
      return;
    }
    setCookie(CookieName._utoken, user.data.token);
    setCookie(CookieName._uuid, user.data.userId);
    setNeedClean(true);
    setTimeout(() => {
      setNeedClean(false);
    }, 1000);
    const { userRenew } = storeUserRenew.getState();
    storeUserRenew.dispatch(changeUserRenew({ userRenew: !userRenew }));
    log('info', locale.successLogin, { token: user.data.token }, !isSignUp);
  };

  const onClickRestoreButton = async () => {
    const error = checkRestoreFields();
    if (error) {
      return;
    }
    if (buttonError) {
      setButtonError('');
    }
    setLoad(true);
    const forgotRes = await request.forgotPassword({ email });
    log(forgotRes.status, forgotRes.message, {}, true);
    if (forgotRes.status === 'info') {
      setNeedClean(true);
      setTimeout(() => {
        setNeedClean(false);
      }, 1000);
    }
  };

  const onClickChangePasswordButton = async () => {
    const error = checkChangePasswordFields();
    if (error) {
      return;
    }
    if (buttonError) {
      setButtonError('');
    }
    setLoad(true);
    setEmail(e);
    const resRes = await request.restorePassword({ email: e, key: k, password });
    log(resRes.status, resRes.message, resRes, true);
    if (resRes.status === 'info') {
      onClickLoginButton();
    }
  };

  const onClickRegisterButton = async () => {
    const error = checkRegisterFields();
    if (error) {
      return;
    }
    if (buttonError) {
      setButtonError('');
    }
    setLoad(true);

    const createRes = await request.userCreate({ name, password, email });
    setLoad(false);
    if (createRes.status !== 'info' || !createRes.data) {
      log('info', createRes.message, '', true);
      return;
    }
    log('info', locale.successRegistration, '', true);
    setTimeout(() => {
      onClickLoginButton();
    }, 1000);
  };

  /**
   * Open error dialog
   */
  useEffect(() => {
    setErrorDialogOpen(pageError !== '');
  }, [pageError, setErrorDialogOpen]);

  /**
   * Check key
   */
  useEffect(() => {
    if (e && k) {
      (async () => {
        const checkRes = await request.checkRestoreKey({ email: e, key: k });
        if (checkRes.status !== 'info') {
          setPageError(checkRes.message);
        }
      })();
    }
  }, [e, k]);

  return {
    onClickLoginButton,
    onClickRegisterButton,
    buttonError,
    setButtonError,
    onClickRestoreButton,
    onClickChangePasswordButton,
    pageError,
    setPageError,
    needClean,
  };
};

export const useClean = ({
  setEmail,
  setEmailError,
  setName,
  setNameError,
  setPassword,
  setPasswordError,
  setPasswordRepeat,
  setPasswordRepeatError,
  setSurname,
  setSurnameError,
  setTabActive,
  setTabsError,
  setEmailSuccess,
  setPasswordRepeatSuccess,
  setPasswordSuccess,
  setButtonError,
  needClean,
}: {
  setNameError: React.Dispatch<React.SetStateAction<string>>;
  setButtonError: React.Dispatch<React.SetStateAction<string>>;
  setTabsError: React.Dispatch<React.SetStateAction<string>>;
  setSurnameError: React.Dispatch<React.SetStateAction<string>>;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordRepeatError: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setTabActive: React.Dispatch<React.SetStateAction<number>>;
  setSurname: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setPasswordRepeat: React.Dispatch<React.SetStateAction<string>>;
  setEmailSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordRepeatSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  needClean: boolean;
}) => {
  const cleanAllFields = useMemo(
    () => () => {
      setEmail('');
      setEmailError('');
      setName('');
      setNameError('');
      setPassword('');
      setPasswordError('');
      setPasswordRepeat('');
      setPasswordRepeatError('');
      setSurname('');
      setSurnameError('');
      setTabActive(TAB_INDEX_DEFAULT);
      setTabsError('');
      setEmailSuccess(false);
      setPasswordRepeatSuccess(false);
      setPasswordSuccess(false);
      setButtonError('');
    },
    [
      setButtonError,
      setEmail,
      setEmailError,
      setEmailSuccess,
      setName,
      setNameError,
      setPassword,
      setPasswordError,
      setPasswordRepeat,
      setPasswordRepeatError,
      setPasswordRepeatSuccess,
      setPasswordSuccess,
      setSurname,
      setSurnameError,
      setTabActive,
      setTabsError,
    ]
  );

  /**
   * Listen need clean
   */
  useEffect(() => {
    if (needClean) {
      cleanAllFields();
    }
  }, [needClean, cleanAllFields]);

  return { cleanAllFields };
};

export const useErrorDialog = () => {
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);

  return { errorDialogOpen, setErrorDialogOpen };
};

export const useRedirect = ({ user }: { user: UserCleanResult }) => {
  const router = useRouter();
  const { r } = useQueryString<{ r?: string }>();

  /**
   * Check is logged
   */
  useEffect(() => {
    if (user) {
      if (r) {
        router.push(r);
        return;
      }
      router.push(Pages.home);
    }
  }, [user, router, r]);
};
