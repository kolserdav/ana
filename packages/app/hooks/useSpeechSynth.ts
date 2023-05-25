import { useEffect, useState } from 'react';
import { log } from '../utils/lib';
import { SPEECH_SPEED_DEFAULT } from '../utils/constants';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';

const useSpeechSynth = ({
  text,
  voiceNotFound,
  lang,
}: {
  text: string;
  lang: string | undefined;
  voiceNotFound: string;
}) => {
  const [textToSpeech, setTextToSpeech] = useState<string>();
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();
  const [synthAllow, setSynthAllow] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(SPEECH_SPEED_DEFAULT);

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
        const synth = window.speechSynthesis;
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
  }, [voiceNotFound, lang]);

  /**
   * Speech text
   */
  useEffect(() => {
    if (!lang) {
      return;
    }
    if (!textToSpeech) {
      return;
    }

    if (typeof androidTextToSpeech !== 'undefined') {
      androidTextToSpeech.speak(textToSpeech);
    } else {
      const synth = window.speechSynthesis;
      if (!synth || !voice) {
        return;
      }

      const utterThis = new SpeechSynthesisUtterance(textToSpeech);

      utterThis.lang = voice.lang;
      utterThis.rate = speechSpeed;
      synth.speak(utterThis);
    }

    setTextToSpeech('');
  }, [textToSpeech, lang, voice, speechSpeed]);

  const speechText = () => {
    setTextToSpeech(text);
  };

  return { speechText, synthAllow, speechSpeed, changeSpeechSpeed };
};

export default useSpeechSynth;
