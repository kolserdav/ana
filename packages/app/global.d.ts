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
}

export {};
