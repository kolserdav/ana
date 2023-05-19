/* eslint-disable no-unused-vars */
declare global {
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

    /**
     *
     * @returns {string} Like Record<0, 'ru'>
     */
    getAvailableLocales: () => string;

    setAvailableLocales: () => void;

    /**
     *
     * @param rate {string} Like "0.5"
     */
    setSpeechRate: (rate: string) => void;
  }

  const androidTextToSpeech: AndroidTextToSpeech | undefined;

  interface AndroidCommon {
    closeApp: () => void;
  }

  const androidCommon: AndroidCommon | undefined;
}

export {};
