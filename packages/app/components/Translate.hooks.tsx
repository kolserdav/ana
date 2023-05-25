/* eslint-disable camelcase */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ServerLanguage } from '../types';
import Request from '../utils/request';
import { cleanPath, log, shortenString } from '../utils/lib';
import {
  FOCUS_TEXTAREA_TIMEOUT,
  LEARN_LANG_DEFAULT,
  NATIVE_LANG_DEFAULT,
  PHRASE_MAX_LENGTH,
  Pages,
  TEXTAREA_ROWS,
  TRANSLATE_DELAY,
} from '../utils/constants';
import { Locale, PhraseUpdateResult, TagFindManyResult } from '../types/interfaces';
import useTagsGlobal from '../hooks/useTags';
import { RECOGNITION_LANGS } from './Translate.lib';
import {
  LocalStorageName,
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '../utils/localStorage';

const request = new Request();
let oldText = '';

export const useLanguages = ({
  undo,
  setUndo,
  textareaRef,
  connId,
}: {
  setUndo: React.Dispatch<React.SetStateAction<boolean>>;
  undo: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  connId: string | null;
}) => {
  const [text, setText] = useState<string>('');
  const [translate, setTranslate] = useState<string>('');
  const [nativeLang, setNativeLang] = useState<string>();
  const [learnLang, setLearnLang] = useState<string>();
  const [langs, setLangs] = useState<ServerLanguage[]>([]);
  const [changeLang, setChangeLang] = useState<boolean>(false);

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
   * Set saved text
   */
  useEffect(() => {
    if (!connId) {
      return;
    }
    const _text = getLocalStorage(LocalStorageName.TEXT);
    if (!_text) {
      return;
    }
    setText(_text);
  }, [connId]);

  /**
   * Set default langs
   */
  useEffect(() => {
    const _learnLang = getLocalStorage(LocalStorageName.LEARN_LANG);
    setLearnLang(_learnLang || LEARN_LANG_DEFAULT);

    const _nativeLang = getLocalStorage(LocalStorageName.NATIVE_LANG);
    setNativeLang(_nativeLang || NATIVE_LANG_DEFAULT);
  }, []);

  const changeLangWrapper =
    (type: 'native' | 'learn') => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = e;
      switch (type) {
        case 'native':
          setNativeLang(value);
          setLocalStorage(LocalStorageName.NATIVE_LANG, value);
          break;
        case 'learn':
          setLearnLang(value);
          setLocalStorage(LocalStorageName.LEARN_LANG, value);
          break;
        default:
      }
      if (undo) {
        setUndo(false);
      }
      setChangeLang(true);
    };

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

  const focusTextArea = () => {
    const { current } = textareaRef;
    if (!current) {
      return;
    }
    setTimeout(() => {
      current.focus();
      current.selectionEnd = oldText.length;
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(current.childNodes[0], oldText.length);
      range.collapse(true);

      if (!sel) {
        return;
      }

      sel.removeAllRanges();
      sel.addRange(range);
    }, FOCUS_TEXTAREA_TIMEOUT);
  };

  const onClickChangeLangs = () => {
    setNativeLang(learnLang);
    setLearnLang(nativeLang);
    setText(translate);
    oldText = translate;
    if (undo) {
      setUndo(false);
    }
    focusTextArea();
  };

  return {
    learnLang,
    nativeLang,
    langs,
    changeLangWrapper,
    changeLang,
    setChangeLang,
    setNativeLang,
    setLearnLang,
    onClickChangeLangs,
    text,
    translate,
    setText,
    setTranslate,
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
  text,
  translate,
  setText,
  setTranslate,
  connId,
  missingCSRF,
  setUndo,
  undo,
}: {
  learnLang: string | undefined;
  nativeLang: string | undefined;
  changeLang: boolean;
  translate: string;
  setTranslate: React.Dispatch<React.SetStateAction<string>>;
  setUndo: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  undo: boolean;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setChangeLang: React.Dispatch<React.SetStateAction<boolean>>;
  setNativeLang: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLearnLang: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTags: React.Dispatch<React.SetStateAction<TagFindManyResult>>;
  setAddTags: React.Dispatch<React.SetStateAction<boolean>>;
  connId: string | null;
  missingCSRF: string;
}) => {
  const router = useRouter();

  const [reTranslate, setRetranslate] = useState<string>('');
  const [rows, setRows] = useState<number>(TEXTAREA_ROWS);
  const [edit, setEdit] = useState<string | null>(null);
  const [restart, setRestart] = useState<boolean>(false);
  const [phraseToUpdate, setPhraseToUpdate] = useState<PhraseUpdateResult>(null);

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
      setPhraseToUpdate(phrase.data);
      setText(phrase.data.text);
      setNativeLang(phrase.data.nativeLang);
      setLearnLang(phrase.data.learnLang);
      const tags = phrase.data.PhraseTag.map((item) => item.Tag);
      setTags(tags);
      setAddTags(tags.length !== 0);
    })();
  }, [edit, setNativeLang, setLearnLang, setTags, setAddTags, restart, setText]);

  /**
   * Tranlate
   */
  useEffect(() => {
    clearTimeout(timeout);
    if (!text || !learnLang || !nativeLang) {
      return;
    }
    if (!connId) {
      log('warn', missingCSRF, connId, true);
      return;
    }
    const runTranslate = async (q: string) => {
      const data = await request.translate({
        q,
        source: learnLang,
        target: nativeLang,
        connId,
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
  }, [text, learnLang, nativeLang, changeLang, setChangeLang, setTranslate, connId, missingCSRF]);

  const changeText = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const {
      target: { value, scrollHeight, clientHeight },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = e as any;
    if (scrollHeight > clientHeight) {
      setRows(rows + 1);
    }
    if (undo) {
      setUndo(false);
    }
    let _value = value;
    if (value.length > PHRASE_MAX_LENGTH) {
      _value = shortenString(value, PHRASE_MAX_LENGTH);
    }
    setLocalStorage(LocalStorageName.TEXT, _value);
    setText(_value);
  };

  const cleanText = () => {
    oldText = text;
    setText('');
    setRows(TEXTAREA_ROWS);
    setTranslate('');
    setRetranslate('');
    setAddTags(false);
    setTags([]);
    setUndo(true);
    removeLocalStorage(LocalStorageName.TEXT);
    if (edit) {
      setEdit(null);
      router.push(cleanPath(router.asPath));
    }
  };

  const revertText = () => {
    setText(oldText);
    setUndo(false);
  };

  /**
   * Retranslate
   */
  useEffect(() => {
    if (!translate || !nativeLang || !learnLang) {
      return;
    }
    if (!connId) {
      log('warn', missingCSRF, connId, true);
      return;
    }
    const runRetranslate = async (q: string) => {
      const data = await request.translate({
        q,
        source: nativeLang,
        target: learnLang,
        connId,
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
  }, [translate, learnLang, nativeLang, connId, missingCSRF]);

  const setRightText = () => {
    oldText = text;
    setUndo(true);
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
    reTranslate,
    rows,
    cleanText,
    onKeyDownReTranslate,
    onClickRetranslate,
    edit,
    restart,
    setRestart,
    phraseToUpdate,
    revertText,
  };
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
  tagRestart,
  setTagRestart,
  addTags,
  tags,
}: {
  text: string;
  tags: TagFindManyResult;
  setTags: React.Dispatch<React.SetStateAction<TagFindManyResult>>;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  learnLang: string | undefined;
  nativeLang: string | undefined;
  edit: string | null;
  restart: boolean;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  tagRestart: boolean;
  setTagRestart: React.Dispatch<React.SetStateAction<boolean>>;
  addTags: boolean;
  translate?: string;
}) => {
  const router = useRouter();
  const [saveDialog, setSaveDialog] = useState<boolean>(false);
  const [saveTranslate, setSaveTranslate] = useState<boolean>(true);

  const onClickSavePhrase = () => {
    setSaveDialog(true);
  };

  const onClickSave = async () => {
    if (!learnLang || !nativeLang) {
      return;
    }

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
    if (saveRes.status === 'info' && saveRes.data) {
      setSaveDialog(false);
      setTags([]);
      setRestart(!restart);
      setTagRestart(!tagRestart);
      router.push(`${router.asPath}?edit=${saveRes.data.id}`);
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
        tags: addTags ? tags.map((item) => item.id) : [],
      },
    });
    setLoad(false);
    log(saveRes.status, saveRes.message, saveRes, true);
    if (saveRes.status === 'info') {
      setSaveDialog(false);
      setRestart(!restart);
      setTagRestart(!tagRestart);
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

export const useTags = ({
  setLoad,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newTag, setNewTag] = useState<string>('');
  const [tagRestart, setTagRestart] = useState<boolean>(false);
  const [addTags, setAddTags] = useState<boolean>(false);
  const [deleteTagDialog, setDeleteTagDialog] = useState<boolean>(false);
  const [tagToDelete, setTagToDelete] = useState<TagFindManyResult[0] | null>(null);
  const [tagToUpdate, setTagToUpdate] = useState<TagFindManyResult[0] | null>(null);

  const { tags, setTags, onClickTagCheepWrapper, allTags } = useTagsGlobal({ restart: tagRestart });

  const createTag = async (text: string) => {
    const res = await request.tagCreate({ text });
    log(res.status, res.message, res, true);
    if (res.status !== 'info') {
      return;
    }
    setNewTag('');
    setTagRestart(!tagRestart);
  };

  const updateTag = async (text: string) => {
    if (!tagToUpdate) {
      log('warn', 'Tag to update is missing', {});
      return;
    }
    const res = await request.tagUpdate({ tagId: tagToUpdate.id, data: { text } });
    log(res.status, res.message, res, true);
    if (res.status !== 'info') {
      return;
    }
    setNewTag('');
    setTagRestart(!tagRestart);
  };

  const onChangeNewTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setNewTag(value);
    if (value[value.length - 1] === ' ') {
      if (tagToUpdate) {
        updateTag(value.trim());
      } else {
        createTag(value.trim());
      }
    }
  };

  const onClickTagUpdateWrapper = (tag: TagFindManyResult[0]) => () => {
    setTagToUpdate(tag);
    setNewTag(tag.text);
  };

  const onClickTagDeleteWrapper = (tag: TagFindManyResult[0]) => () => {
    setTagToDelete(tag);
    setDeleteTagDialog(true);
  };

  const onClickCancelDeleteTag = () => {
    setTagToDelete(null);
    setDeleteTagDialog(false);
  };

  const onClickDeleteTag = async () => {
    if (!tagToDelete) {
      log('warn', 'Tag to delete is missing', tagToDelete);
      return;
    }
    setLoad(true);
    const delRes = await request.tagDelete({ tagId: tagToDelete.id });
    setLoad(false);
    log(delRes.status, delRes.message, delRes, true);
    if (delRes.status !== 'info') {
      return;
    }
    setTagRestart(!tagRestart);
    setTagToDelete(null);
    setDeleteTagDialog(false);
  };

  return {
    allTags,
    newTag,
    onChangeNewTag,
    tags,
    onClickTagCheepWrapper,
    addTags,
    setAddTags,
    setTags,
    onClickTagDeleteWrapper,
    onClickTagUpdateWrapper,
    tagToDelete,
    tagToUpdate,
    deleteTagDialog,
    setDeleteTagDialog,
    onClickCancelDeleteTag,
    onClickDeleteTag,
    tagRestart,
    setTagRestart,
  };
};

export const useSpeechRecognize = ({
  setText,
  locale,
  learnLang,
}: {
  setText: React.Dispatch<React.SetStateAction<string>>;
  locale: Locale['app']['translate'];
  learnLang: string | undefined;
}) => {
  const [allowRecogn, setAllowRecogn] = useState<boolean>(false);
  const [allowMicro, setAllowMicro] = useState<boolean>();
  const [recognition, setRecognition] = useState<webkitSpeechRecognition>();

  const recognitionLang = useMemo(() => {
    if (!learnLang) {
      return null;
    }

    let res: string | null = null;
    RECOGNITION_LANGS.every((item) => {
      if (new RegExp(`^${learnLang}`).test(item[1][0])) {
        // eslint-disable-next-line prefer-destructuring
        res = item[1][0];
        return false;
      }
      return true;
    });

    return res;
  }, [learnLang]);

  /**
   * Give microphone access
   */
  useEffect(() => {
    if (!navigator.mediaDevices) {
      log('warn', 'Media devices is', navigator.mediaDevices);
      return;
    }

    const checkMicro = async () =>
      new Promise<boolean>((resolve) => {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            resolve(true);
          })
          .catch((err) => {
            log('error', 'Error get user media', err);
            resolve(false);
          });
      });

    (async () => {
      setAllowMicro(await checkMicro());
    })();
  }, []);

  /**
   * Set recognition
   */
  useEffect(() => {
    if (typeof allowMicro === 'boolean' && !allowMicro) {
      log('warn', locale.microNotPermitted, {}, true);
      return;
    }
    if (!('webkitSpeechRecognition' in window)) {
      log('warn', locale.recognizeNotSupport, {}, allowMicro);
      return;
    }

    // eslint-disable-next-line new-cap
    const _recognition = new webkitSpeechRecognition();
    setAllowRecogn(true);
    setRecognition(_recognition);
  }, [allowMicro, locale.recognizeNotSupport, locale.microNotPermitted, recognitionLang]);

  const onStartRecognize = () => {
    if (!recognitionLang) {
      return;
    }
    if (!recognition) {
      log('warn', 'Recognition not found in onStartRecognize');
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      log('warn', locale.recognizeNotSupport, {}, true);
    } else {
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        log('info', 'Start speech recognize');
      };

      recognition.onerror = (event) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        log('error', `${locale.errorSpeechRecog}: ${(event as any)?.error}`, event, true);
      };

      recognition.onend = () => {
        log('info', 'End speech recognize');
      };

      recognition.onresult = (event) => {
        let intTranscipt = '';
        if (typeof event.results === 'undefined') {
          recognition.onend = null;
          recognition.stop();
          return;
        }

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setText(event.results[i][0].transcript);
          } else {
            intTranscipt += event.results[i][0].transcript;
            setText(intTranscipt);
          }
        }
      };

      recognition.lang = recognitionLang;
      recognition.start();
    }
  };

  const onStopRecognize = () => {
    if (!recognition) {
      log('warn', 'Recognition not found in onStopRecognize');
      return;
    }
    recognition.stop();
  };

  return { onStartRecognize, onStopRecognize, allowRecogn };
};

export const useUndo = () => {
  const [undo, setUndo] = useState<boolean>(false);

  return { undo, setUndo };
};

export const useRedirect = () => {
  const router = useRouter();

  const loginRedirect = () => {
    router.push(`${Pages.signIn}?r=${router.asPath}`);
  };

  return { loginRedirect };
};
