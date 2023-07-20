import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  FORM_ITEM_MARGIN_TOP,
  INPUT_HEIGHT,
  INPUT_MARGIN_BOTTOM,
  LEARN_LANG_DEFAULT,
  Pages,
  SPEECH_TEST_TEXT_DEFAULT,
} from '../utils/constants';
import { ServerLanguage } from '../types';
import Request from '../utils/request';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { Locale, UserCleanResult } from '../types/interfaces';
import { log, wait } from '../utils/lib';
import useLogin from '../hooks/useLogin';
import storeUserRenew, { changeUserRenew } from '../store/userRenew';
import { checkUrl } from './Settings.lib';

const request = new Request();

export const useTestSpeech = ({ lang }: { lang: string }) => {
  const [testText, setTestText] = useState<string>(SPEECH_TEST_TEXT_DEFAULT);
  const [voiceTestText, setVoiceTestText] = useState<Record<string, string>>();
  const [allTestText, setAllTestText] = useState<string>();
  const [saveVoiceTestText, setSaveVoiceTestText] = useState(false);
  const [saveAllTestText, setSaveAllTestText] = useState(false);

  const onChangeTestText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setTestText(value);
    if (saveVoiceTestText) {
      const _speechTestText = getLocalStorage(LocalStorageName.SPEECH_VOICE_TEST_TEXT) || {};
      _speechTestText[lang] = value;
      setLocalStorage(LocalStorageName.SPEECH_VOICE_TEST_TEXT, _speechTestText);
      setVoiceTestText(_speechTestText);
    }

    if (saveAllTestText) {
      let _speechTestText = getLocalStorage(LocalStorageName.SPEECH_TEST_TEXT) || '';
      _speechTestText = value;
      setLocalStorage(LocalStorageName.SPEECH_TEST_TEXT, _speechTestText);
      setAllTestText(value);
    }
  };

  useEffect(() => {
    if (!voiceTestText || !allTestText) {
      return;
    }
    const _testText =
      saveVoiceTestText && voiceTestText[lang]
        ? voiceTestText[lang]
        : saveAllTestText && allTestText
        ? allTestText
        : SPEECH_TEST_TEXT_DEFAULT;
    setTestText(_testText);
  }, [lang, saveVoiceTestText, saveAllTestText, allTestText, voiceTestText]);

  /**
   * Set test text
   */
  useEffect(() => {
    if (!saveVoiceTestText && !saveAllTestText) {
      setTestText(SPEECH_TEST_TEXT_DEFAULT);
      return;
    }
    const _speechTestText =
      getLocalStorage(
        saveAllTestText
          ? LocalStorageName.SPEECH_TEST_TEXT
          : LocalStorageName.SPEECH_VOICE_TEST_TEXT
      ) || (saveAllTestText ? '' : {});
    log('info', 'Settings.hooks', { lang, _speechTestText });
    if (typeof _speechTestText !== 'string' && _speechTestText[lang]) {
      setTestText(_speechTestText[lang]);
    } else if (typeof _speechTestText === 'string') {
      setTestText(_speechTestText);
    } else {
      setTestText(SPEECH_TEST_TEXT_DEFAULT);
    }
  }, [lang, saveVoiceTestText, saveAllTestText]);

  /**
   * Set save test text
   */
  useEffect(() => {
    const _saveVoiceTestText = getLocalStorage(LocalStorageName.SAVE_VOICE_TEXT_TEST) || false;
    if (_saveVoiceTestText) {
      setSaveVoiceTestText(_saveVoiceTestText);
    }

    const _saveAllTestText = getLocalStorage(LocalStorageName.SAVE_ALL_TEXT_TEST) || false;
    if (_saveAllTestText) {
      setSaveAllTestText(_saveAllTestText);
    }
  }, []);

  const onChangeSaveVoiceTestText = () => {
    const _saveTestText = !saveVoiceTestText;
    setLocalStorage(LocalStorageName.SAVE_VOICE_TEXT_TEST, _saveTestText);
    setSaveVoiceTestText(_saveTestText);
  };

  const onChangeSaveAllTestText = () => {
    const _saveTestText = !saveAllTestText;
    setLocalStorage(LocalStorageName.SAVE_ALL_TEXT_TEST, _saveTestText);
    setSaveAllTestText(_saveTestText);
  };

  return {
    testText,
    onChangeTestText,
    saveVoiceTestText,
    onChangeSaveVoiceTestText,
    onChangeSaveAllTestText,
    saveAllTestText,
  };
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
  passwordRepeat,
  passwordsDoNotMatch,
  setPasswordRepeatError,
}: {
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  user: UserCleanResult | null;
  passwordRepeat: string;
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
  setPasswordRepeatError: React.Dispatch<React.SetStateAction<string>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  fieldMustBeNotEmpty: string;
  passwordsDoNotMatch: string;
  eliminateRemarks: string;
  localeLogin: Locale['app']['login'];
}) => {
  const [buttonError, setButtonError] = useState<string>('');
  const [needClean, setNeedClean] = useState<boolean>(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);

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
      if (password !== passwordRepeat) {
        setPasswordRepeatError(passwordsDoNotMatch);
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

    if (password) {
      onClickLoginButton();
    }
  };

  const changePasswordHeight = useMemo(
    () => (INPUT_HEIGHT + INPUT_MARGIN_BOTTOM + FORM_ITEM_MARGIN_TOP) * 3,
    []
  );

  return {
    buttonError,
    onClickSaveButton,
    needClean,
    setButtonError,
    changePassword,
    setChangePassword,
    changePasswordHeight,
  };
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

export const useDeleteAccount = ({
  user,
  setLoad,
  locale,
}: {
  user: UserCleanResult | null;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  locale: Locale['app']['settings'];
}) => {
  const router = useRouter();
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);
  const [deleteSecure, setDeleteSecure] = useState<string>('');
  const [canDeleteAccount, setCanDeleteAccount] = useState<boolean>(false);
  const [acceptDeleteWarning, setAcceptDeleteWarning] = useState<boolean>(false);

  const onChangeDeleteSecure = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setDeleteSecure(value);
  };

  const onClickOpenDeleteAccount = () => {
    setDeleteAccount(true);
  };

  const onClickCloseDelete = () => {
    setDeleteAccount(false);
    setDeleteSecure('');
    setAcceptDeleteWarning(false);
  };

  const onClickDeleteAccount = async () => {
    if (!canDeleteAccount || !user) {
      return;
    }
    setLoad(true);
    const res = await request.userDelete({ userId: user.id });
    setLoad(false);
    log(res.status, res.message, { res }, true);
    if (res.status === 'info') {
      setDeleteSecure('');
      const { userRenew } = storeUserRenew.getState();
      storeUserRenew.dispatch(changeUserRenew({ userRenew: !userRenew }));
      setTimeout(() => {
        router.push(Pages.signIn);
      }, 1000);
    }
  };

  const onKeyDownDeleteAccount = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      setDeleteAccount(true);
    }
  };

  /**
   * Set can delete account
   */
  useEffect(() => {
    setCanDeleteAccount(deleteSecure === locale.deleteMyAccount);
  }, [deleteSecure, locale.deleteMyAccount]);

  return {
    deleteAccount,
    setDeleteAccount,
    onClickOpenDeleteAccount,
    onClickCloseDelete,
    onClickDeleteAccount,
    onKeyDownDeleteAccount,
    deleteSecure,
    onChangeDeleteSecure,
    canDeleteAccount,
    acceptDeleteWarning,
    setAcceptDeleteWarning,
  };
};

export const useConfirmEmail = ({
  user,
  setLoad,
  emailIsSend,
}: {
  user: UserCleanResult | null;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  emailIsSend: string;
}) => {
  const [sendConfirmEmail, setSendConfirmEmail] = useState<boolean>(false);

  const onClickCloseConfirmEmail = () => {
    setSendConfirmEmail(false);
  };

  const onClickOpenConfirmEmail = () => {
    setSendConfirmEmail(true);
  };

  const onClickConfirmEmail = async () => {
    if (!user) {
      log('warn', 'User is missin in onClickConfirmEmail', { user });
      return;
    }
    setLoad(true);
    const res = await request.sendConfirmEmail({ email: user.email, userId: user.id });
    log(res.status, res.message, { res }, true, true);
    setLoad(false);
    if (res.status !== 'info') {
      return;
    }
    setSendConfirmEmail(false);
    setTimeout(() => {
      log('warn', emailIsSend, { res }, true, true);
    }, 500);
  };

  return {
    sendConfirmEmail,
    setSendConfirmEmail,
    onClickCloseConfirmEmail,
    onClickConfirmEmail,
    onClickOpenConfirmEmail,
  };
};

export const useChangeNode = ({
  url,
  urlDefault,
  wrongUrlFormat,
  serverIsNotRespond,
  successCheckNode,
  needUpdateApp,
}: {
  urlDefault: string;
  url: null | string;
  wrongUrlFormat: string;
  serverIsNotRespond: string;
  successCheckNode: string;
  needUpdateApp: string;
}) => {
  const [isDefaultNode, setIsDefaultNode] = useState(false);
  const [isNode, setIsNode] = useState(false);
  const [node, setNode] = useState(url || '');
  const [nodeError, setNodeError] = useState('');
  const [nodeSuccess, setNodeSuccess] = useState(false);

  const onChangeRadioWrapper = useCallback(
    (name: 'url' | 'urlDefault') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { checked },
      } = e;
      switch (name) {
        case 'url':
          if (checked) {
            if (nodeSuccess) {
              log('info', successCheckNode, { name }, true);
            }
            setIsNode(checked);
            if (typeof androidCommon !== 'undefined' && node) {
              if (typeof androidCommon.setUrl === 'undefined') {
                log('warn', needUpdateApp, {}, true, true);
                return;
              }
              androidCommon.setUrl(node);
            }
          }
          if (isDefaultNode) {
            setIsDefaultNode(false);
          }
          break;
        case 'urlDefault':
          setIsDefaultNode(checked);
          if (checked) {
            log('info', successCheckNode, { name }, true);
          }
          if (typeof androidCommon !== 'undefined') {
            if (typeof androidCommon.setUrl === 'undefined') {
              log('warn', needUpdateApp, {}, true, true);
              return;
            }
            androidCommon.setUrl('null');
          }
          if (isNode) {
            setIsNode(false);
          }
          break;
        default:
      }
    },
    [isDefaultNode, isNode, node, needUpdateApp, successCheckNode, nodeSuccess]
  );

  const onChangeNewNode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setNode(value);

    if (!checkUrl(value)) {
      setNodeError(wrongUrlFormat);
      return;
    }
    setNodeError('');

    if (nodeSuccess && value !== node) {
      await wait(1000);
    }
    const result = await request.checkNewUrl(value);
    if (result.status === 'info') {
      log('info', successCheckNode, { result }, true);
      if (typeof androidCommon !== 'undefined') {
        if (typeof androidCommon.setUrl === 'undefined') {
          log('warn', needUpdateApp, {}, true, true);
          return;
        }
        androidCommon.setUrl(value);
      }
      setNodeSuccess(true);
    } else {
      log('error', serverIsNotRespond, { result });
      setNodeSuccess(false);
    }
  };

  /**
   * Select node
   */
  useEffect(() => {
    if (!urlDefault) {
      return;
    }
    const {
      location: { origin },
    } = window;
    log('info', 'Android url is', { origin, urlDefault });
    if (urlDefault !== origin) {
      setIsNode(true);
      setNodeSuccess(true);
      setNode(origin);
    } else {
      setIsDefaultNode(true);
    }
  }, [urlDefault]);

  return {
    isDefaultNode,
    onChangeNewNode,
    node,
    onChangeRadioWrapper,
    isNode,
    nodeError,
    nodeSuccess,
  };
};

export const useListenFocus = () => {
  /**
   * Listen on focus
   */
  useEffect(() => {
    const listenHandler = () => {
      const { userRenew: _userRenew } = storeUserRenew.getState();
      storeUserRenew.dispatch(
        changeUserRenew({
          userRenew: !_userRenew,
        })
      );
    };
    window.addEventListener('focus', listenHandler);

    return () => {
      window.addEventListener('focus', listenHandler);
    };
  }, []);
};
