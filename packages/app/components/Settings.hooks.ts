import { useEffect, useMemo, useState } from 'react';
import { LEARN_LANG_DEFAULT, TEST_TEXT_DEFAULT } from '../utils/constants';
import { ServerLanguage } from '../types';
import Request from '../utils/request';
import { LocalStorageName, getLocalStorage } from '../utils/localStorage';
import { Locale, UserCleanResult } from '../types/interfaces';
import { log } from '../utils/lib';
import useLogin from '../hooks/useLogin';

const request = new Request();

export const useTestSpeech = () => {
  const [testText, setTestText] = useState<string>(TEST_TEXT_DEFAULT);

  const onChangeTestText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setTestText(value);
  };

  return { testText, onChangeTestText };
};

export const useLanguage = () => {
  const [langs, setLangs] = useState<ServerLanguage[]>([]);
  const [lang, setLang] = useState<string>(LEARN_LANG_DEFAULT);

  /**
   * Set langs
   */
  useEffect(() => {
    (async () => {
      const _langs = await request.getLanguages();
      if (typeof _langs.map === 'function') {
        setLangs(_langs);
      }
    })();
  }, []);

  /**
   * Set lang
   */
  useEffect(() => {
    const _learnLang = getLocalStorage(LocalStorageName.LEARN_LANG);
    setLang(_learnLang || LEARN_LANG_DEFAULT);
  }, []);

  const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;
    setLang(value);
  };

  return { lang, changeLang, langs };
};

export const usePersonalData = ({
  setName,
  setEmail,
  user,
  email,
  name,
  emailError,
  setEmailError,
  setLoad,
  setPasswordError,
  password,
  passwordError,
  oldPassword,
  oldPasswordError,
  setOldPasswordError,
  passwordRepeatError,
  fieldMustBeNotEmpty,
  eliminateRemarks,
  localeLogin,
}: {
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  user: UserCleanResult | null;
  name: string;
  email: string;
  emailError: string;
  password: string;
  oldPassword: string;
  passwordError: string;
  oldPasswordError: string;
  passwordRepeatError: string;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setOldPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  fieldMustBeNotEmpty: string;
  eliminateRemarks: string;
  localeLogin: Locale['app']['login'];
}) => {
  const [buttonError, setButtonError] = useState<string>('');
  const [needClean, setNeedClean] = useState<boolean>(false);

  const { onClickLoginButton } = useLogin({
    email,
    emailError,
    password,
    passwordError,
    setEmailError,
    setButtonError,
    fieldMustBeNotEmpty,
    locale: localeLogin,
    setPasswordError,
    buttonError,
    eliminateRemarks,
    setLoad,
    isSignUp: true,
    setNeedClean,
  });

  /**
   * Set user data
   */
  useEffect(() => {
    if (!user) {
      return;
    }
    setName(user.name || '');
    setEmail(user.email);
  }, [setName, setEmail, user]);

  const checkFields = () => {
    let res = 0;
    if (!email) {
      setEmailError(fieldMustBeNotEmpty);
      res = 1;
    }
    if (password) {
      if (!oldPassword) {
        setOldPasswordError(fieldMustBeNotEmpty);
        res = 1;
      }
    }
    return res;
  };

  const onClickSaveButton = async () => {
    if (!user) {
      return;
    }
    setButtonError('');
    const check = checkFields();
    if (check || emailError || passwordError || passwordRepeatError || oldPasswordError) {
      setButtonError(eliminateRemarks);
      return;
    }
    setLoad(true);
    const res = await request.userUpdate({
      userId: user.id,
      name,
      email,
      password: { newPassword: password, oldPassword },
    });
    setLoad(false);
    log(res.status, res.message, { res }, true);
    if (res.code === 401) {
      setOldPasswordError(res.message);
    }
    if (res.status !== 'info' || !res.data) {
      return;
    }

    onClickLoginButton();
  };

  return { buttonError, onClickSaveButton, needClean, setButtonError };
};

export const useClean = ({
  setEmailError,
  setNameError,
  setPassword,
  setPasswordError,
  setPasswordRepeat,
  setPasswordRepeatError,
  setEmailSuccess,
  setPasswordRepeatSuccess,
  setPasswordSuccess,
  setButtonError,
  setOldPassword,
  setOldPasswordError,
  setOldPasswordSuccess,
  needClean,
}: {
  setNameError: React.Dispatch<React.SetStateAction<string>>;
  setButtonError: React.Dispatch<React.SetStateAction<string>>;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordRepeatError: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setPasswordRepeat: React.Dispatch<React.SetStateAction<string>>;
  setOldPassword: React.Dispatch<React.SetStateAction<string>>;
  setOldPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setOldPasswordSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setEmailSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordRepeatSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  needClean: boolean;
}) => {
  const cleanAllFields = useMemo(
    () => () => {
      setEmailError('');
      setNameError('');
      setPassword('');
      setPasswordError('');
      setPasswordRepeat('');
      setPasswordRepeatError('');
      setEmailSuccess(false);
      setPasswordRepeatSuccess(false);
      setPasswordSuccess(false);
      setOldPassword('');
      setOldPasswordError('');
      setOldPasswordSuccess(false);
      setButtonError('');
    },
    [
      setButtonError,
      setEmailError,
      setEmailSuccess,
      setNameError,
      setPassword,
      setPasswordError,
      setPasswordRepeat,
      setPasswordRepeatError,
      setPasswordRepeatSuccess,
      setPasswordSuccess,
      setOldPassword,
      setOldPasswordError,
      setOldPasswordSuccess,
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
};
