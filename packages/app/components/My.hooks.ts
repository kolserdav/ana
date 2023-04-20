import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OrderBy, PhraseFindManyResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';
import { ORDER_BY_DEFAULT, Pages } from '../utils/constants';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';

const request = new Request();

export const usePhrases = () => {
  const [phrases, setPhrases] = useState<PhraseFindManyResult>([]);
  const [restart, setRestart] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<OrderBy>();

  /**
   * Set order by
   */
  useEffect(() => {
    const _orderBy = getLocalStorage(LocalStorageName.ORDER_BY);
    setOrderBy(_orderBy || ORDER_BY_DEFAULT);
  }, []);

  /**
   * Set phrases
   */
  useEffect(() => {
    if (!orderBy) {
      return;
    }
    (async () => {
      const _phrases = await request.phraseFindMany({ orderBy });
      if (_phrases.status !== 'info') {
        log(_phrases.status, _phrases.message, _phrases, true);
        return;
      }
      setPhrases(_phrases.data);
    })();
  }, [restart, orderBy]);

  const onClickSortByDate = () => {
    const _orderBy = orderBy === 'asc' ? 'desc' : 'asc';
    setOrderBy(_orderBy);
    setLocalStorage(LocalStorageName.ORDER_BY, _orderBy);
  };

  return { phrases, setRestart, restart, orderBy, onClickSortByDate };
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
  const [phraseToDelete, setPhraseToDelete] = useState<PhraseFindManyResult[0] | null>(null);

  const onClickDeletePhraseWrapper = (phrase: PhraseFindManyResult[0]) => () => {
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

export const usePhraseUpdate = () => {
  const router = useRouter();

  const onClickPhraseUpdateWraper = (phrase: PhraseFindManyResult[0]) => () => {
    router.push(`${Pages.translate}?edit=${phrase.id}`);
  };

  return { onClickPhraseUpdateWraper };
};
