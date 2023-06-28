/* eslint-disable no-unused-vars */
// eslint-disable-next-line max-classes-per-file

declare global {
  interface GlobalProps {
    getUrlDefault?: (d: string) => void;
  }

  class webkitSpeechRecognition {
    public continuous: boolean;

    public interimResults: boolean;

    public onstart: () => void;

    public lang: string;

    public onerror: (e: Error) => void;

    public onresult: (e: {
      results?: { isFinal: boolean; 0: { transcript: string } }[];
      resultIndex: number;
    }) => void;

    public onend: (() => void) | null;

    public start: () => void;

    public stop: () => void;
  }

  interface AndroidTextToSpeech {
    speak: (text: string) => void;

    setLanguage: (lang: string) => void;

    getLanguage: () => string;

    /**
     * @returns {string} Like Record<0, 'ru'>
     */
    getAvailableLocales: () => string;

    setAvailableLocales: () => void;

    /**
     * @returns {string} Like Record<en, 'english'>
     */
    getAvailableVoices: () => string;

    cancel: () => void;

    isSpeaking: () => boolean;

    /**
     *
     * @param rate {string} Like "0.5"
     */
    setSpeechRate: (rate: string) => void;

    setVoice: (lang: string) => void;
  }

  const androidTextToSpeech: AndroidTextToSpeech | undefined;

  interface AndroidCommon {
    closeApp: () => void;

    setKeepScreenOn: (sleep: boolean) => void;

    copyToClipboard: (text: string) => void;

    setInterfaceLanguage: (languageCode: string) => void;

    getUrlDefault: GlobalProps['getUrlDefault'];
  }

  const androidCommon: AndroidCommon | undefined;
}

export {};
