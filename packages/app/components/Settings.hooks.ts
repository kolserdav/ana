import { useState } from 'react';
import { TEST_TEXT_DEFAULT } from '../utils/constants';

// eslint-disable-next-line import/prefer-default-export
export const useTestSpeech = () => {
  const [testText, setTestText] = useState<string>(TEST_TEXT_DEFAULT);

  const onChangeTestText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setTestText(value);
  };

  return { testText, onChangeTestText };
};
