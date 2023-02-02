import {
  checkEmail,
  DEFAULT_LOCALE,
  Locale,
  MessageType,
  SendMessageArgs,
} from '@/types/interfaces';
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  SURNAME_MAX_LENGTH,
  TAB_INDEX_DEFAULT,
} from '@/utils/constants';
import { CookieName, getCookie, getLangCookie, setCookie } from '@/utils/cookies';
import { log } from '@/utils/lib';
import WS from '@/utils/ws';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { checkSignUp, checkName, checkPasswordError } from './Login.lib';

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
          lang: getCookie(CookieName.lang) || DEFAULT_LOCALE,
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

  const isSignUp = checkSignUp(router.asPath);

  return { isSignUp };
};

let send = false;

export const useMessages = ({
  setConnId,
  setEmailError,
  setEmailSuccess,
  setLoad,
  ws,
  locale,
  isSignUp,
  cleanAllFields,
  email,
  password,
}: {
  setConnId: React.Dispatch<React.SetStateAction<string>>;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setEmailSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  ws: WS;
  locale: Locale['app']['login'];
  isSignUp: boolean;
  cleanAllFields: () => void;
  email: string;
  password: string;
}) => {
  const setUserCheckEmail = useMemo(
    () =>
      ({ data }: SendMessageArgs<MessageType.SET_USER_CHECK_EMAIL>) => {
        if (isSignUp && data) {
          setEmailError(locale.emailIsRegistered);
          setEmailSuccess(false);
        } else if (!isSignUp && !data) {
          setEmailError(locale.emailIsNotRegistered);
          setEmailSuccess(false);
        }
      },
    [setEmailError, isSignUp, locale, setEmailSuccess]
  );

  const setUserCreate = useMemo(
    () =>
      ({ id, lang }: SendMessageArgs<MessageType.SET_USER_CREATE>) => {
        ws.sendMessage({
          id,
          type: MessageType.GET_USER_LOGIN,
          lang,
          data: {
            email,
            password,
          },
        });
        log('info', locale.successRegistration, '', true);
      },
    [email, locale.successRegistration, password, ws]
  );

  const setUserLogin = useMemo(
    () =>
      ({ data: { token } }: SendMessageArgs<MessageType.SET_USER_LOGIN>) => {
        setCookie(CookieName._utoken, token);
        cleanAllFields();
        setLoad(false);
        log('info', locale.successLogin, { token }, !isSignUp);
      },
    [cleanAllFields, isSignUp, locale.successLogin, setLoad]
  );

  const setError = useMemo(
    () =>
      ({ data: { status, message, httpCode } }: SendMessageArgs<MessageType.SET_ERROR>) => {
        setLoad(false);
        log(status, message, { httpCode }, true);
      },
    [setLoad]
  );

  useEffect(() => {
    if (!send) {
      send = true;
      setTimeout(() => {
        log('info', 'test 1', {}, true);
      }, 200);
      setTimeout(() => {
        log('warn', 'test 2', {}, true);
      }, 200);
      setTimeout(() => {
        log('error', 'test 3', {}, true);
      }, 200);
      setTimeout(() => {
        log('warn', 'test 4', {}, true);
      }, 200);
      setTimeout(() => {
        log('error', 'test 5', {}, true);
      }, 200);
    }
  }, []);

  /**
   * Connect to WS
   */
  useEffect(() => {
    if (!ws.connection) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
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
        default:
          log('warn', 'Not implemented on ws message case in login', rawMessage);
      }
    };
  }, [ws, setConnId, setUserCheckEmail, setError, setUserCreate, setUserLogin]);
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
  tabSelected,
  tabActive,
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
  setSurnameError: React.Dispatch<React.SetStateAction<string>>;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordRepeatError: React.Dispatch<React.SetStateAction<string>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  tabSelected: boolean;
  tabActive: number;
  ws: WS;
}) => {
  const [buttonError, setButtonError] = useState<string>('');

  const role = useMemo(
    () => locale.tabs.find((item) => item.id === tabActive)?.value || 'employer',
    [tabActive, locale]
  );

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
    setLoad(true);
    ws.sendMessage({
      type: MessageType.GET_USER_LOGIN,
      id: connId,
      lang: getLangCookie(),
      data: {
        email,
        password,
      },
    });
  };

  const onClickRegisterButton = () => {
    const error = checkRegisterFields();
    if (error) {
      return;
    }
    setLoad(true);
    ws.sendMessage({
      type: MessageType.GET_USER_CREATE,
      id: connId,
      lang: getLangCookie(),
      data: {
        name,
        email,
        password,
        passwordRepeat,
        surname,
        role,
      },
    });
  };
  return { onClickLoginButton, onClickRegisterButton, buttonError };
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
}: {
  setNameError: React.Dispatch<React.SetStateAction<string>>;
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
  };

  return { cleanAllFields };
};
