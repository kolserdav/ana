import { useEffect, useState } from 'react';
import { ServerLanguage } from '../types';
import Request from '../utils/request';
import { log } from '../utils/lib';
import { TEXTAREA_ROWS, TRANSLATE_DELAY } from '../utils/constants';
import { Locale, TagFindManyResult } from '../types/interfaces';

const request = new Request();

export const useLanguages = () => {
  const [nativeLang, setNativeLang] = useState<string>('ru');
  const [learnLang, setLearnLang] = useState<string>('en');
  const [langs, setLangs] = useState<ServerLanguage[]>([]);
  const [changeLang, setChangeLang] = useState<boolean>(false);

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
      setChangeLang(true);
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

  return { learnLang, nativeLang, langs, changeLangWrapper, changeLang, setChangeLang };
};

let timeout = setTimeout(() => {
  /**/
}, 0);

export const useTranslate = ({
  learnLang,
  nativeLang,
  changeLang,
  setChangeLang,
}: {
  learnLang: string;
  nativeLang: string;
  changeLang: boolean;
  setChangeLang: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [text, setText] = useState<string>('');
  const [translate, setTranslate] = useState<string>('');
  const [reTranslate, setRetranslate] = useState<string>('');
  const [rows, setRows] = useState<number>(TEXTAREA_ROWS);

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

    timeout = setTimeout(
      () => {
        runTranslate(text);
        setChangeLang(false);
      },
      changeLang ? 0 : TRANSLATE_DELAY
    );
  }, [text, learnLang, nativeLang, changeLang, setChangeLang]);

  const changeText = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const {
      target: { value, scrollHeight, clientHeight },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = e as any;
    if (scrollHeight > clientHeight) {
      setRows(rows + 1);
    }

    setText(value);
  };

  const cleanText = () => {
    setText('');
    setRows(TEXTAREA_ROWS);
    setTranslate('');
    setRetranslate('');
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

  const setRightText = () => {
    setText(reTranslate);
  };

  const onKeyDownReTranslate = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setRightText();
    }
  };

  // eslint-disable-next-line no-unused-vars
  const onClickRetranslate = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setRightText();
  };

  return {
    changeText,
    translate,
    reTranslate,
    rows,
    cleanText,
    text,
    onKeyDownReTranslate,
    onClickRetranslate,
  };
};

export const useSpeechSynth = ({
  reTranslate,
  locale,
  learnLang,
}: {
  reTranslate: string;
  learnLang: string;
  locale: Locale['app']['translate'];
}) => {
  const [textToSpeech, setTextToSpeech] = useState<string>();
  const [synthAllow, setSynthAllow] = useState<boolean>(false);

  /**
   * Speech text
   */
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) {
      log('warn', 'Speech synth is not support', { synth });
      setSynthAllow(false);
      return;
    }
    const voices = synth.getVoices();
    const voice = voices.find((item) => new RegExp(`${learnLang}`).test(item.lang));
    if (!voice) {
      log('warn', locale.voiceNotFound, voices, true);
      setSynthAllow(false);
      return;
    }

    if (!synthAllow) {
      setSynthAllow(true);
    }

    if (!textToSpeech) {
      return;
    }

    const utterThis = new SpeechSynthesisUtterance(textToSpeech);

    utterThis.lang = voice.lang;
    synth.speak(utterThis);

    setTextToSpeech('');
  }, [synthAllow, textToSpeech, locale, learnLang]);

  const speechRetranslate = () => {
    setTextToSpeech(reTranslate);
  };

  return { synthAllow, speechRetranslate };
};

export const useSavePhrase = ({
  text,
  translate,
  setLoad,
}: {
  text: string;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  translate?: string;
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [saveDialog, setSaveDialog] = useState<boolean>(false);
  const [saveTranslate, setSaveTranslate] = useState<boolean>(true);

  const onClickSavePhrase = () => {
    setSaveDialog(true);
  };

  const onClickSave = async () => {
    setLoad(true);
    const saveRes = await request.phraseCreate({
      text,
      translate: saveTranslate ? translate : undefined,
      tags: [],
    });
    setLoad(false);
    log(saveRes.status, saveRes.message, saveRes, true);
  };

  return {
    tags,
    onClickSavePhrase,
    saveDialog,
    setSaveDialog,
    saveTranslate,
    setSaveTranslate,
    onClickSave,
  };
};

export const useTags = () => {
  const [allTags, setAllTags] = useState<TagFindManyResult>([]);
  const [newTag, setNewTag] = useState<string>('');

  /**
   * Set all tags
   */
  useEffect(() => {
    (async () => {
      const tags = await request.tagFindMany();
      setAllTags(tags.data);
    })();
  }, []);

  const onChangeNewTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    console.log(value);
  };

  const createTag = () => {
    /** */
  };

  return { allTags, newTag, onChangeNewTag };
};
