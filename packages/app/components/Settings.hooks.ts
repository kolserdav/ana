import { useEffect, useState } from 'react';
import { LEARN_LANG_DEFAULT, TEST_TEXT_DEFAULT } from '../utils/constants';
import { ServerLanguage } from '../types';
import Request from '../utils/request';
import { LocalStorageName, getLocalStorage } from '../utils/localStorage';
import { getSpeechSpeeds } from './Settings.lib';

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
