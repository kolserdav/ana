import { useEffect, useState } from 'react';
import { ServerLanguage } from '../types';
import Request from '../utils/request';
import { log } from '../utils/lib';
import { TRANSLATE_DELAY } from '../utils/constants';

const request = new Request();

export const useLanguages = () => {
  const [nativeLang, setNativeLang] = useState<string>('ru');
  const [learnLang, setLearnLang] = useState<string>('en');
  const [langs, setLangs] = useState<ServerLanguage[]>([]);

  const changeLangWrapper =
    (type: 'native' | 'learn') => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = e;
      switch (type) {
        case 'native':
          setNativeLang(value);
          break;
        case 'learn':
          setLearnLang(value);
          break;
        default:
      }
    };

  /**
   * Set langs
   */
  useEffect(() => {
    (async () => {
      const _langs = await request.getLanguages();
      setLangs(_langs);
    })();
  }, []);

  return { learnLang, nativeLang, langs, changeLangWrapper };
};

let timeout = setTimeout(() => {
  /**/
}, 0);

export const useTranslate = ({
  learnLang,
  nativeLang,
}: {
  learnLang: string;
  nativeLang: string;
}) => {
  const [text, setText] = useState<string>('');
  const [translate, setTranslate] = useState<string>('');
  const [reTranslate, setRetranslate] = useState<string>('');
  const [startDelay, setStartDelay] = useState<number>(0);

  /**
   * Tranlate
   */
  useEffect(() => {
    clearTimeout(timeout);
    if (!text || !learnLang || !nativeLang) {
      return;
    }

    const runTranslate = async (q: string) => {
      const data = await request.translate({
        q,
        source: learnLang,
        target: nativeLang,
      });

      if (data.status === 'error' || !data.translatedText) {
        if (data.message) {
          log('error', data.message, data, true);
        } else if (data.error) {
          log('error', data.error, data, true);
        } else {
          log('error', 'Unexpected response', data);
        }
        return;
      }

      log('info', 'Translate result', data);
      setTranslate(data.translatedText);
    };

    timeout = setTimeout(() => {
      runTranslate(text);
    }, TRANSLATE_DELAY);
  }, [text, learnLang, nativeLang, startDelay]);

  const changeText = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setStartDelay(new Date().getTime());
    const {
      target: { value },
    } = e as any;
    setText(value);
  };

  /**
   * Retranslate
   */
  useEffect(() => {
    if (!translate || !nativeLang || !learnLang) {
      return;
    }
    const runRetranslate = async (q: string) => {
      const data = await request.translate({
        q,
        source: nativeLang,
        target: learnLang,
      });

      if (data.status === 'error' || !data.translatedText) {
        if (data.message) {
          log('error', data.message, data, true);
        } else if (data.error) {
          log('error', data.error, data, true);
        } else {
          log('error', 'Unexpected respose', data);
        }
        return;
      }

      log('info', 'Re translate result', data);
      setRetranslate(data.translatedText);
    };
    runRetranslate(translate);
  }, [translate, learnLang, nativeLang]);

  return { changeText, translate, reTranslate };
};
