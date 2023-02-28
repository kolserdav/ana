import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import useQueryString from '../hooks/useQueryString';
import storeUserRenew, { changeUserRenew } from '../store/userRenew';
import {
  checkEmail,
  LOCALE_DEFAULT,
  Locale,
  MessageType,
  SendMessageArgs,
  PAGE_RESTORE_PASSWORD_CALLBACK,
  EMAIL_QS,
  KEY_QS,
} from '../types/interfaces';
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  Pages,
  PASSWORD_MIN_LENGTH,
  SURNAME_MAX_LENGTH,
  TAB_INDEX_DEFAULT,
} from '../utils/constants';
import { CookieName, getCookie, getLangCookie, setCookie } from '../utils/cookies';
import { awaitResponse, checkRouterPath, log } from '../utils/lib';
import WS from '../utils/ws';
import { checkName, checkPasswordError } from './Login.lib';

export const useEmailInput = ({
  locale,
  connId,
  ws,
}: {
  locale: Locale['app']['login'];
  connId: string;
  ws: WS;
}) => {
  const [emailError, setEmailError] = useState<string>('');
  const [emailSuccess, setEmailSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length < EMAIL_MAX_LENGTH) {
      const check = checkEmail(value);
      if (check) {
        ws.sendMessage({
          type: MessageType.GET_USER_CHECK_EMAIL,
          id: connId,
          timeout: new Date().getTime(),
          lang: getCookie(CookieName.lang) || LOCALE_DEFAULT,
          data: {
            email: value,
          },
        });
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

export const useMessages = ({
  setConnId,
  setEmailError,
  setEmailSuccess,
  setLoad,
  onClickLoginButton,
  ws,
  locale,
  isSignUp,
  cleanAllFields,
  setPageError,
  email,
  password,
  setButtonError,
  setPasswordError,
}: {
  setConnId: React.Dispatch<React.SetStateAction<string>>;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setEmailSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setButtonError: React.Dispatch<React.SetStateAction<string>>;
  setPageError: React.Dispatch<React.SetStateAction<string>>;
  onClickLoginButton: () => void;
  ws: WS;
  locale: Locale['app']['login'];
  isSignUp: boolean;
  cleanAllFields: () => void;
  email: string;
  password: string;
}) => {
  /**
   * Connect to WS
   */
  useEffect(() => {
    if (!ws.connection) {
      return;
    }

    const setUserLogin = ({
      data: { token, userId },
    }: SendMessageArgs<MessageType.SET_USER_LOGIN>) => {
      setCookie(CookieName._utoken, token);
      setCookie(CookieName._uuid, userId);
      cleanAllFields();
      const { userRenew } = storeUserRenew.getState();
      storeUserRenew.dispatch(changeUserRenew({ userRenew: !userRenew }));
      log('info', locale.successLogin, { token }, !isSignUp);
    };

    const setError = async ({
      data: { status, message, httpCode, type },
      timeout,
    }: SendMessageArgs<MessageType.SET_ERROR>) => {
      await awaitResponse(timeout);
      switch (type) {
        case MessageType.GET_USER_LOGIN:
          if (httpCode === 401) {
            setPasswordError(message);
          }
          setButtonError(message);
          break;
        case MessageType.GET_CHECK_RESTORE_KEY:
          setPageError(message);
          break;
        default:
      }
      log(status, message, { httpCode }, true);
    };

    const setForgotPassword = ({
      data: { message },
    }: SendMessageArgs<MessageType.SET_FORGOT_PASSWORD>) => {
      log('info', message, {}, true);
      cleanAllFields();
    };

    const setUserCreate = ({ id, lang }: SendMessageArgs<MessageType.SET_USER_CREATE>) => {
      setTimeout(() => {
        ws.sendMessage({
          id,
          type: MessageType.GET_USER_LOGIN,
          lang,
          timeout: new Date().getTime(),
          data: {
            email,
            password,
          },
        });
      }, 1000);
      log('info', locale.successRegistration, '', true);
    };

    const setUserCheckEmail = ({ data }: SendMessageArgs<MessageType.SET_USER_CHECK_EMAIL>) => {
      if (isSignUp && data) {
        setEmailError(locale.emailIsRegistered);
        setEmailSuccess(false);
      } else if (!isSignUp && !data) {
        setEmailError(locale.emailIsNotRegistered);
        setEmailSuccess(false);
      }
    };

    const setRestorePassword = (_: SendMessageArgs<MessageType.SET_RESTORE_PASSWORD>) => {
      onClickLoginButton();
    };

    // eslint-disable-next-line no-param-reassign
    ws.connection.onmessage = async (msg) => {
      const { data } = msg;
      const rawMessage = ws.parseMessage(data);
      if (!rawMessage) {
        return;
      }
      const { type, id, timeout } = rawMessage;
      switch (type) {
        case MessageType.SET_CONNECTION_ID:
          setConnId(id);
          setCookie(CookieName._uuid, id);
          break;
        case MessageType.SET_USER_CREATE:
          setUserCreate(rawMessage);
          break;
        case MessageType.SET_USER_LOGIN:
          setUserLogin(rawMessage);
          break;
        case MessageType.SET_USER_CHECK_EMAIL:
          setUserCheckEmail(rawMessage);
          break;
        case MessageType.SET_ERROR:
          setError(rawMessage);
          break;
        case MessageType.SET_CHECK_RESTORE_KEY:
          //
          break;
        case MessageType.SET_FORGOT_PASSWORD:
          setForgotPassword(rawMessage);
          break;
        case MessageType.SET_RESTORE_PASSWORD:
          setRestorePassword(rawMessage);
          break;
        default:
          log('warn', 'Not implemented on ws message case in login', rawMessage);
      }
      await awaitResponse(timeout);
      setLoad(false);
    };
  }, [
    ws,
    setConnId,
    setLoad,
    setButtonError,
    setPageError,
    cleanAllFields,
    isSignUp,
    locale,
    email,
    password,
    setEmailError,
    setEmailSuccess,
    onClickLoginButton,
    setPasswordError,
  ]);
};

export const useButton = ({
  connId,
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
  tabActive,
  setEmail,
  ws,
}: {
  connId: string;
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
  tabSelected: boolean;
  tabActive: number;
  ws: WS;
}) => {
  const [buttonError, setButtonError] = useState<string>('');
  const [pageError, setPageError] = useState<string>('');

  const { e, k } = useQueryString<{ [EMAIL_QS]: string; [KEY_QS]: string }>();

  const role = useMemo(
    () => locale.tabs.find((item) => item.id === tabActive)?.value || 'employer',
    [tabActive, locale]
  );

  const checkRestoreFields = () => {
    let error = false;
    if (!email || emailError) {
      error = true;
      if (!email) {
        setEmailError(locale.fieldMustBeNotEmpty);
      }
    }
    setButtonError(error ? locale.eliminateRemarks : '');
    return error;
  };

  const checkLoginFields = () => {
    let error = false;
    if (!email || emailError) {
      error = true;
      if (!email) {
        setEmailError(locale.fieldMustBeNotEmpty);
      }
    }
    if (!password || passwordError) {
      error = true;
      if (!password) {
        setPasswordError(locale.fieldMustBeNotEmpty);
      }
    }
    setButtonError(error ? locale.eliminateRemarks : '');
    return error;
  };

  const checkChangePasswordFields = () => {
    let error = false;
    if (!password || passwordError) {
      error = true;
      if (!password) {
        setPasswordError(locale.fieldMustBeNotEmpty);
      }
    }
    if (!passwordRepeat || passwordRepeatError) {
      if (!passwordRepeat) {
        setPasswordRepeatError(locale.fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (!e || !k) {
      setPageError(locale.wrongParameters);
      error = true;
    }
    setButtonError(error ? locale.eliminateRemarks : '');
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
        setNameError(locale.fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (!surname || surnameError) {
      if (!surname) {
        setSurnameError(locale.fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (!email || emailError) {
      error = true;
      if (!email) {
        setEmailError(locale.fieldMustBeNotEmpty);
      }
    }
    if (!password || passwordError) {
      if (!password) {
        setPasswordError(locale.fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (!passwordRepeat || passwordRepeatError) {
      if (!passwordRepeat) {
        setPasswordRepeatError(locale.fieldMustBeNotEmpty);
      }
      error = true;
    }
    if (passwordRepeat !== password) {
      setPasswordRepeatError(locale.passwordsDoNotMatch);
      error = true;
    }
    setButtonError(error ? locale.eliminateRemarks : '');
    return error;
  };

  const onClickLoginButton = () => {
    const error = checkLoginFields();
    if (error) {
      return;
    }
    if (buttonError) {
      setButtonError('');
    }
    setLoad(true);
    ws.sendMessage({
      type: MessageType.GET_USER_LOGIN,
      id: connId,
      timeout: new Date().getTime(),
      lang: getLangCookie(),
      data: {
        email,
        password,
      },
    });
  };

  const onClickRestoreButton = () => {
    const error = checkRestoreFields();
    if (error) {
      return;
    }
    if (buttonError) {
      setButtonError('');
    }
    setLoad(true);
    ws.sendMessage({
      timeout: new Date().getTime(),
      id: connId,
      lang: getLangCookie(),
      type: MessageType.GET_FORGOT_PASSWORD,
      data: {
        email,
      },
    });
  };

  const onClickChangePasswordButton = () => {
    const error = checkChangePasswordFields();
    if (error) {
      return;
    }
    if (buttonError) {
      setButtonError('');
    }
    setLoad(true);
    setEmail(e);
    ws.sendMessage({
      type: MessageType.GET_RESTORE_PASSWORD,
      id: connId,
      timeout: new Date().getTime(),
      lang: getLangCookie(),
      data: {
        email: e,
        password,
        key: k,
      },
    });
  };

  const onClickRegisterButton = () => {
    const error = checkRegisterFields();
    if (error) {
      return;
    }
    if (buttonError) {
      setButtonError('');
    }
    setLoad(true);
    ws.sendMessage({
      type: MessageType.GET_USER_CREATE,
      id: connId,
      lang: getLangCookie(),
      timeout: new Date().getTime(),
      data: {
        name,
        email,
        password,
        surname,
        role,
      },
    });
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
      ws.sendMessage({
        id: connId,
        lang: getLangCookie(),
        timeout: new Date().getTime(),
        type: MessageType.GET_CHECK_RESTORE_KEY,
        data: { email: e, key: k },
      });
    }
  }, [e, k, connId, ws]);

  return {
    onClickLoginButton,
    onClickRegisterButton,
    buttonError,
    setButtonError,
    onClickRestoreButton,
    onClickChangePasswordButton,
    pageError,
    setPageError,
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
}) => {
  const cleanAllFields = () => {
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
  };

  return { cleanAllFields };
};

export const useErrorDialog = () => {
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);

  return { errorDialogOpen, setErrorDialogOpen };
};

export const useRedirect = ({
  user,
}: {
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'];
}) => {
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
      const { role } = user;
      switch (role) {
        case 'employer':
          router.push(Pages.meEmployer);
          break;
        case 'worker':
          router.push(Pages.meWorker);
          break;
        default:
          router.push(Pages.home);
      }
    }
  }, [user, router, r]);
};
