import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { OrderBy, PhraseFindManyResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';
import { ORDER_BY_DEFAULT, Pages, TAKE_PHRASES_DEFAULT } from '../utils/constants';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import storeScroll from '../store/scroll';

const request = new Request();

let _load = false;

export const usePhrases = ({
  setLoad,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const lastRef = useRef<HTMLDivElement>(null);

  const [phrases, setPhrases] = useState<PhraseFindManyResult>([]);
  const [phrasesChunk, setPhrasesChunk] = useState<PhraseFindManyResult>([]);
  const [restart, setRestart] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<OrderBy>();
  const [skip, setSkip] = useState<number>(0);
  const [take, setTake] = useState<number>(TAKE_PHRASES_DEFAULT);
  const [count, setCount] = useState<number>(0);

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
    if (phrasesChunk.length) {
      const _chunk = take === TAKE_PHRASES_DEFAULT ? phrasesChunk : phrases.concat(phrasesChunk);
      setPhrases(_chunk);
      setPhrasesChunk([]);
    }
  }, [phrases, phrasesChunk, take]);

  /**
   * Set phrases chunk
   */
  useEffect(() => {
    if (!orderBy) {
      return;
    }
    (async () => {
      setLoad(true);
      const _phrases = await request.phraseFindMany({
        orderBy,
        skip: skip.toString(),
        take: take.toString(),
      });
      setLoad(false);
      if (_phrases.status !== 'info') {
        log(_phrases.status, _phrases.message, _phrases, true);
        return;
      }
      setCount(_phrases.count || 0);
      setPhrasesChunk(_phrases.data);
      setTimeout(() => {
        _load = false;
      }, 0);
    })();
  }, [restart, orderBy, skip, take, setLoad]);

  const onClickSortByDate = () => {
    const _orderBy = orderBy === 'asc' ? 'desc' : 'asc';
    setOrderBy(_orderBy);
    setLocalStorage(LocalStorageName.ORDER_BY, _orderBy);
    setTake(TAKE_PHRASES_DEFAULT);
    setSkip(0);
  };

  /**
   * Listen scroll
   */
  useEffect(() => {
    const cleanSubs = storeScroll.subscribe(() => {
      const { scrollY } = window;
      const { current } = lastRef;
      if (!current) {
        return;
      }
      const { y } = current.getBoundingClientRect();

      if (scrollY > y && phrases.length < count && !_load) {
        _load = true;
        setTake(take + TAKE_PHRASES_DEFAULT);
        setSkip(skip + TAKE_PHRASES_DEFAULT);
      }
    });

    return () => {
      cleanSubs();
    };
  }, [count, phrases.length, take, skip]);

  return { phrases, setRestart, restart, orderBy, onClickSortByDate, lastRef };
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
