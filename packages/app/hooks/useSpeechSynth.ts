import { useEffect, useState } from 'react';
import { Locale } from '../types/interfaces';
import { log } from '../utils/lib';

const useSpeechSynth = ({
  text,
  locale,
  lang,
}: {
  text: string;
  lang: string | undefined;
  locale: Locale['app']['translate'];
}) => {
  const [textToSpeech, setTextToSpeech] = useState<string>();
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();
  const [synthAllow, setSynthAllow] = useState<boolean>(false);
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
          log('warn', locale.voiceNotFound, voices, true);
          setSynthAllow(false);
          return;
        }
        setSynthAllow(true);
        setVoice(_voice);
      }
    })();
  }, [locale.voiceNotFound, lang]);

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
      synth.speak(utterThis);
    }

    setTextToSpeech('');
  }, [textToSpeech, locale, lang, voice]);

  const speechText = () => {
    setTextToSpeech(text);
  };

  return { speechText, synthAllow };
};

export default useSpeechSynth;
