import { useEffect, useState } from 'react';
import { PhraseFindManyResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';

const request = new Request();

export const usePhrases = () => {
  const [phrases, setPhrases] = useState<PhraseFindManyResult>([]);

  /**
   * Set phrases
   */
  useEffect(() => {
    (async () => {
      const _phrases = await request.phraseFindMany();
      if (_phrases.status !== 'info') {
        log(_phrases.status, _phrases.message, _phrases, true);
        return;
      }
      setPhrases(_phrases.data);
    })();
  }, []);

  return { phrases };
};

export const usePhraseDelete = () => {
  const [deletePhrase, setDeletePhrase] = useState<boolean>(false);
  const [phraseToDelete, setPhraseToDelete] = useState<PhraseFindManyResult[any] | null>(null);

  const onClickDeletePhraseWrapper = (phrase: PhraseFindManyResult[any]) => () => {
    setPhraseToDelete(phrase);
    setDeletePhrase(true);
  };

  const onClickCloseDelete = () => {
    setPhraseToDelete(null);
    setDeletePhrase(false);
  };

  const onClickDeletePhrase = () => {
    console.log(phraseToDelete);
  };

  return {
    deletePhrase,
    setDeletePhrase,
    onClickDeletePhraseWrapper,
    phraseToDelete,
    onClickCloseDelete,
    onClickDeletePhrase,
  };
};
