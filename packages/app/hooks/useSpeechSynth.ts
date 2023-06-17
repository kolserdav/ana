import { useCallback, useEffect, useMemo, useState } from 'react';
import { log } from '../utils/lib';
import { SPEECH_SPEED_DEFAULT } from '../utils/constants';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { VolumeIcon } from '../types';
import { cleanLinks } from '../components/My.lib';

let speaking = false;

const useSpeechSynth = ({
  text,
  voiceNotFound,
  lang,
  onStop,
  changeLinkTo,
}: {
  text: string;
  lang: string | undefined;
  voiceNotFound: string;
  onStop?: () => void;
  changeLinkTo?: string;
}) => {
  const [textToSpeech, setTextToSpeech] = useState<string>();
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();
  const [synthAllow, setSynthAllow] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(SPEECH_SPEED_DEFAULT);
  const [volumeIcon, setVolumeIcon] = useState<VolumeIcon>('high');
  const [volumeIconUp, setVolumeIconUp] = useState<boolean>(true);
  const [androidSpeaking, setAndroidSpeaking] = useState<boolean>(false);

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
    if (typeof androidTextToSpeech !== 'undefined') {
      androidTextToSpeech.setLanguage(lang);

      setSynthAllow(true);
    }
  }, [lang]);

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
        let voices = synth.getVoices();
        if (voices.length === 0) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(0);
            }, 1000);
          });
          voices = synth.getVoices();
        }

        const _voice = voices.find((item) => new RegExp(`${lang}`).test(item.lang));
        if (!_voice) {
          log('warn', voiceNotFound, voices, true);
          setSynthAllow(false);
          return;
        }
        setSynthAllow(true);
        setVoice(_voice);
      }
    })();
  }, [voiceNotFound, lang, synth]);

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

      utterThis.lang = voice.lang;
      utterThis.rate = speechSpeed;
      synth.speak(utterThis);
    }

    setTextToSpeech(undefined);
  }, [textToSpeech, lang, voice, speechSpeed, synth, stopSpeech]);

  const speechText = () => {
    setTextToSpeech(cleanLinks(text, changeLinkTo));
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

  return { speechText, synthAllow, speechSpeed, changeSpeechSpeed, volumeIcon, stopSpeech };
};

export default useSpeechSynth;
