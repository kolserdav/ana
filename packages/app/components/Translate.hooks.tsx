import { useEffect, useState } from 'react';
import { ServerLanguage } from '../types';
import Request from '../utils/request';
import { log } from '../utils/lib';

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

  /**
   * Tranlate
   */
  useEffect(() => {
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
        } else {
          log('error', data.message, data);
        }
        return;
      }

      log('info', 'Translate result', data);
      setTranslate(data.translatedText);
    };

    const last = text[text.length - 1];
    if (/(\s|[!.?:,])/g.test(last)) {
      runTranslate(text);
    }
  }, [text, learnLang, nativeLang]);

  const changeText = (e: React.FormEvent<HTMLTextAreaElement>) => {
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
        } else {
          log('error', data.message, data);
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
