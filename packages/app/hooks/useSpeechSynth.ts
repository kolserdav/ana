import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { log, wait } from '../utils/lib';
import { LINK_REPLACED, SPEECH_SPEED_DEFAULT } from '../utils/constants';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { VolumeIcon } from '../types';
import { cleanBold, cleanLinks } from '../components/My.lib';

let speaking = false;

const useSpeechSynth = ({
  text,
  voiceNotFound,
  lang,
  onStop,
}: {
  text: string;
  lang: string | undefined;
  voiceNotFound: string;
  onStop?: () => void;
}) => {
  const router = useRouter();

  const [textToSpeech, setTextToSpeech] = useState<string>();
  const [voice, setVoice] = useState<string>();
  const [synthAllow, setSynthAllow] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(SPEECH_SPEED_DEFAULT);
  const [volumeIcon, setVolumeIcon] = useState<VolumeIcon>('high');
  const [volumeIconUp, setVolumeIconUp] = useState<boolean>(true);
  const [androidSpeaking, setAndroidSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<Record<string, string>>({});

  const synth: null | SpeechSynthesis = useMemo(
    () => (typeof window === 'undefined' ? null : window.speechSynthesis),
    []
  );

  const changeSpeechSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    const _value = parseFloat(value);
    setLocalStorage(LocalStorageName.SPEECH_SPEED, _value);
    setSpeechSpeed(_value);
  };

  /**
   * Set android speech speed
   */
  useEffect(() => {
    if (typeof androidTextToSpeech !== 'undefined') {
      androidTextToSpeech.setSpeechRate(speechSpeed.toString());
    }
  }, [speechSpeed]);

  /**
   * Set speed of speech
   */
  useEffect(() => {
    const _speechSpeed = getLocalStorage(LocalStorageName.SPEECH_SPEED);
    if (!_speechSpeed) {
      return;
    }
    setSpeechSpeed(_speechSpeed);
  }, []);

  /**
   * Set android voice
   */
  useEffect(() => {
    if (!lang) {
      return;
    }
    log('info', 'Set android voice with router.locale', router.locale);

    if (typeof androidTextToSpeech !== 'undefined') {
      const setDefaultVoice = (_voices: Record<string, string>) => {
        const langVoices = getLocalStorage(LocalStorageName.LANG_VOICES);
        if (langVoices && langVoices[lang]) {
          setVoice(langVoices[lang]);
          androidTextToSpeech.setVoice(langVoices[lang]);
          return;
        }
        Object.keys(_voices).every((item) => {
          setVoice(item);
          androidTextToSpeech.setVoice(item);
          return false;
        });
      };

      (async () => {
        androidTextToSpeech.setLanguage(lang);
        const waitChange = async (): Promise<number> => {
          const _lang = androidTextToSpeech.getLanguage();

          if (_lang !== lang) {
            await wait(100);
            return waitChange();
          }
          return 0;
        };
        await waitChange();
        let androidVoices = androidTextToSpeech.getAvailableVoices();
        let _voices: Record<string, string> = {};
        if (!androidVoices) {
          androidVoices = androidTextToSpeech.getAvailableVoices();
        }
        try {
          _voices = JSON.parse(androidVoices);
        } catch (e) {
          log('error', 'Error parse android voices', e);
        }
        setDefaultVoice(_voices);
        setVoices(_voices);
        setSynthAllow(true);
      })();
    }
  }, [lang, router.locale]);

  /**
   * Set suitable voice
   */
  useEffect(() => {
    (async () => {
      if (typeof androidTextToSpeech === 'undefined') {
        if (!lang) {
          return;
        }
        if (!synth) {
          log('warn', 'Speech synth is not support', { synth });
          setSynthAllow(false);
          return;
        }
        let _voices = synth.getVoices();
        if (_voices.length === 0) {
          await wait(1000);
          _voices = synth.getVoices();
        }
        if (_voices.length !== 0) {
          const newVoices: typeof voices = {};
          _voices.forEach((item) => {
            newVoices[item.lang] = item.name;
          });
          setVoices(newVoices);
        }

        const _voice = _voices.find((item) => new RegExp(`${lang}`).test(item.lang));
        const langVoices = getLocalStorage(LocalStorageName.LANG_VOICES);
        if (!_voice) {
          log('warn', voiceNotFound, _voices);
          setSynthAllow(false);
        } else {
          setSynthAllow(true);
          if (!langVoices || !langVoices[lang]) {
            setVoice(_voice.lang);
          }
        }

        if (langVoices && langVoices[lang]) {
          setVoice(langVoices[lang]);
        }
      }
    })();
  }, [voiceNotFound, lang, synth]);

  /**
   * Set available locales and voices
   */
  useEffect(() => {
    if (typeof androidTextToSpeech === 'undefined') {
      return;
    }
    androidTextToSpeech.setAvailableLocales();
  }, []);

  /**
   * set android speaking
   */
  useEffect(() => {
    if (typeof androidTextToSpeech === 'undefined') {
      return () => {
        /** */
      };
    }
    let interval = setInterval(() => {
      /** */
    }, Infinity);
    if (androidSpeaking) {
      interval = setInterval(() => {
        const isSpeaking = androidTextToSpeech.isSpeaking();
        if (!isSpeaking) {
          setAndroidSpeaking(false);
        }
      }, 200);
    }

    return () => {
      clearInterval(interval);
    };
  }, [androidSpeaking]);

  const stopSpeech = useCallback(() => {
    if (typeof androidTextToSpeech !== 'undefined') {
      if (androidTextToSpeech.isSpeaking()) {
        androidTextToSpeech.cancel();
        setAndroidSpeaking(false);
      }
    } else {
      if (!synth) {
        return;
      }
      synth.cancel();
    }
    setTextToSpeech(undefined);
  }, [synth]);

  /**
   * Speech text
   */
  useEffect(() => {
    if (!lang || !textToSpeech) {
      return;
    }
    log('info', 'Speech text', { textToSpeech });
    if (typeof androidTextToSpeech !== 'undefined') {
      androidTextToSpeech.isSpeaking();
      if (androidTextToSpeech.isSpeaking()) {
        stopSpeech();
        return;
      }

      setAndroidSpeaking(true);
      androidTextToSpeech.speak(textToSpeech);
    } else {
      if (!synth || !voice) {
        return;
      }

      const utterThis = new SpeechSynthesisUtterance(textToSpeech);

      if (synth.speaking) {
        stopSpeech();
        return;
      }

      utterThis.lang = voice;
      utterThis.rate = speechSpeed;
      synth.speak(utterThis);
    }

    setTextToSpeech(undefined);
  }, [textToSpeech, lang, voice, speechSpeed, synth, stopSpeech]);

  const speechText = () => {
    setTextToSpeech(cleanBold(cleanLinks(text, LINK_REPLACED)));
  };

  /**
   * set folume icon
   */
  useEffect(() => {
    let interval = setInterval(() => {
      /** */
    }, Infinity);
    if (synth?.speaking || androidSpeaking) {
      speaking = true;
      interval = setInterval(() => {
        switch (volumeIcon) {
          case 'high':
            setVolumeIcon('medium');
            break;
          case 'medium':
            if (volumeIconUp) {
              setVolumeIcon('low');
            } else {
              setVolumeIcon('high');
            }
            setVolumeIconUp(!volumeIconUp);
            break;
          case 'low':
            setVolumeIcon('medium');
            break;
          default:
        }
      }, 500);
    } else {
      setVolumeIcon('high');
      if (speaking && onStop) {
        onStop();
        speaking = false;
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [volumeIcon, volumeIconUp, synth?.speaking, androidSpeaking, onStop]);

  const _voices = useMemo(
    () => Object.keys(voices).map((item) => ({ lang: item, value: voices[item] })),
    [voices]
  );

  const changeVoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!lang) {
      return;
    }
    const {
      target: { value },
    } = e;
    if (typeof androidTextToSpeech !== 'undefined') {
      androidTextToSpeech.setVoice(value);
    }
    setVoice(value);
    const langVoices = getLocalStorage(LocalStorageName.LANG_VOICES) || {};
    langVoices[lang] = value;
    setLocalStorage(LocalStorageName.LANG_VOICES, langVoices);
  };

  return {
    speechText,
    synthAllow,
    speechSpeed,
    changeSpeechSpeed,
    volumeIcon,
    stopSpeech,
    voices: _voices,
    changeVoice,
    voice,
  };
};

export default useSpeechSynth;
