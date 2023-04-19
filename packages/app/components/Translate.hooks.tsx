import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ServerLanguage } from '../types';
import Request from '../utils/request';
import { cleanPath, log } from '../utils/lib';
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

  return {
    learnLang,
    nativeLang,
    langs,
    changeLangWrapper,
    changeLang,
    setChangeLang,
    setNativeLang,
    setLearnLang,
  };
};

let timeout = setTimeout(() => {
  /**/
}, 0);

export const useTranslate = ({
  learnLang,
  nativeLang,
  changeLang,
  setChangeLang,
  setNativeLang,
  setLearnLang,
  setTags,
  setAddTags,
}: {
  learnLang: string;
  nativeLang: string;
  changeLang: boolean;
  setChangeLang: React.Dispatch<React.SetStateAction<boolean>>;
  setNativeLang: React.Dispatch<React.SetStateAction<string>>;
  setLearnLang: React.Dispatch<React.SetStateAction<string>>;
  setTags: React.Dispatch<React.SetStateAction<TagFindManyResult>>;
  setAddTags: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [text, setText] = useState<string>('');
  const [translate, setTranslate] = useState<string>('');
  const [reTranslate, setRetranslate] = useState<string>('');
  const [rows, setRows] = useState<number>(TEXTAREA_ROWS);
  const [edit, setEdit] = useState<string | null>(null);
  const [restart, setRestart] = useState<boolean>(false);

  /**
   * Set edit
   */
  useEffect(() => {
    const {
      query: { edit: _edit },
    } = router;

    setEdit(_edit as string);
  }, [router]);

  /**
   * If edit
   */
  useEffect(() => {
    if (!edit) {
      return;
    }
    (async () => {
      const phrase = await request.phraseFindFirst({ phraseId: edit as string });
      log(phrase.status, phrase.message, phrase, true);
      if (phrase.status !== 'info' || !phrase.data) {
        return;
      }
      setText(phrase.data.text);
      setNativeLang(phrase.data.nativeLang);
      setLearnLang(phrase.data.learnLang);
      const tags = phrase.data.PhraseTag.map((item) => item.Tag);
      setTags(tags);
      setAddTags(tags.length !== 0);
    })();
  }, [edit, setNativeLang, setLearnLang, setTags, setAddTags, restart]);

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
    if (edit) {
      setEdit(null);
      router.push(cleanPath(router.asPath));
    }
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
    edit,
    restart,
    setRestart,
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
    if (!learnLang) {
      return;
    }
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
  setTags,
  learnLang,
  nativeLang,
  edit,
  restart,
  setRestart,
  tags,
}: {
  text: string;
  tags: TagFindManyResult;
  setTags: React.Dispatch<React.SetStateAction<TagFindManyResult>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  learnLang: string;
  nativeLang: string;
  edit: string | null;
  restart: boolean;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  translate?: string;
}) => {
  const [saveDialog, setSaveDialog] = useState<boolean>(false);
  const [saveTranslate, setSaveTranslate] = useState<boolean>(true);

  const onClickSavePhrase = () => {
    setSaveDialog(true);
  };

  const onClickSave = async () => {
    setLoad(true);
    const saveRes = await request.phraseCreate({
      text,
      learnLang,
      nativeLang,
      translate: saveTranslate ? translate : undefined,
      tags: tags.map((item) => item.id),
    });
    setLoad(false);
    log(saveRes.status, saveRes.message, saveRes, true);
    if (saveRes.status === 'info') {
      setSaveDialog(false);
      setTags([]);
    }
  };

  const onClickUpdate = async () => {
    if (!edit) {
      log('warn', 'This is not editable phrase', { edit });
      return;
    }
    setLoad(true);
    const saveRes = await request.phraseUpdate({
      phraseId: edit,
      data: {
        text,
        learnLang,
        nativeLang,
        translate: saveTranslate ? translate : undefined,
        tags: tags.map((item) => item.id),
      },
    });
    setLoad(false);
    log(saveRes.status, saveRes.message, saveRes, true);
    if (saveRes.status === 'info') {
      setSaveDialog(false);
      setRestart(!restart);
    }
  };

  return {
    onClickSavePhrase,
    saveDialog,
    setSaveDialog,
    saveTranslate,
    setSaveTranslate,
    onClickSave,
    onClickUpdate,
  };
};

export const useTags = () => {
  const [allTags, setAllTags] = useState<TagFindManyResult>([]);
  const [tags, setTags] = useState<TagFindManyResult>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [restart, setRestart] = useState<boolean>(false);
  const [addTags, setAddTags] = useState<boolean>(false);

  /**
   * Set all tags
   */
  useEffect(() => {
    (async () => {
      const _allTags = await request.tagFindMany();
      setAllTags(_allTags.data);
    })();
  }, [restart]);

  const createTag = async (text: string) => {
    const createRes = await request.tagCreate({ text });
    log(createRes.status, createRes.message, createRes, true);
    if (createRes.status !== 'info') {
      return;
    }
    setNewTag('');
    setRestart(!restart);
  };

  const onChangeNewTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setNewTag(value);
    if (value[value.length - 1] === ' ') {
      createTag(value.trim());
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onClicTagCheepWrapper = (tag: TagFindManyResult[any], command: 'add' | 'del') => () => {
    const _tags = tags.slice();
    const index = _tags.findIndex((item) => item.id === tag.id);
    switch (command) {
      case 'add':
        if (index !== -1) {
          log('warn', 'Duplicate tag', { _tags, tag });
          return;
        }
        _tags.push(tag);
        break;
      case 'del':
        if (index === -1) {
          log('warn', 'Missing tag', { _tags, tag });
          return;
        }
        _tags.splice(index, 1);
        break;
      default:
    }
    setTags(_tags);
  };

  return {
    allTags,
    newTag,
    onChangeNewTag,
    tags,
    onClicTagCheepWrapper,
    addTags,
    setAddTags,
    setTags,
  };
};
