import { useEffect, useState } from 'react';
import { PhraseFindManyResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';

const request = new Request();

export const usePhrases = () => {
  const [phrases, setPhrases] = useState<PhraseFindManyResult>([]);
  const [restart, setRestart] = useState<boolean>(false);

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
  }, [restart]);

  return { phrases, setRestart, restart };
};

export const usePhraseDelete = ({
  setLoad,
  setRestart,
  restart,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  restart: boolean;
}) => {
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

  const onClickDeletePhrase = async () => {
    if (!phraseToDelete) {
      log('warn', 'Phrase to delete is missing', { phraseToDelete });
      return;
    }
    setLoad(true);
    const delRes = await request.phraseDelete({ phraseId: phraseToDelete.id });
    setLoad(false);
    log(delRes.status, delRes.message, delRes, true);
    if (delRes.status !== 'info') {
      return;
    }
    setPhraseToDelete(null);
    setDeletePhrase(false);
    setRestart(!restart);
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
