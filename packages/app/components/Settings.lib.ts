// eslint-disable-next-line import/prefer-default-export
export const getSpeechSpeeds = () => {
  const speeds: number[] = [];
  for (let i = 1; i <= 10; i++) {
    speeds.push(i / 10);
  }
  return speeds;
};

export const checkUrl = (url: string) => /https:\/\/[a-zA-Z0-9-_.]+\.\w+/.test(url);
