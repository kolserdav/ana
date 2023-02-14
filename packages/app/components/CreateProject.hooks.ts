import { useState } from 'react';
import { HTMLEditorOnChange } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const useDescriptionInput = () => {
  const [description, setDescription] = useState('');

  const onChangeDescription: HTMLEditorOnChange = (e) => {
    const _e: {
      readonly level: {
        readonly content: string;
      };
    } = e as any;
    setDescription(_e.level.content);
  };

  return { description, onChangeDescription };
};
