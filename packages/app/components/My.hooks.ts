import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { OrderBy, PhraseFindManyResult, TagFindManyResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';
import { ORDER_BY_DEFAULT, Pages, TAKE_PHRASES_DEFAULT } from '../utils/constants';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import storeScroll from '../store/scroll';
import useTagsGlobal from '../hooks/useTags';

const request = new Request();

let _load = false;

export const usePhrases = ({
  setLoad,
  tags,
  setSkip,
  skip,
  strongTags,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  tags: TagFindManyResult;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  skip: number;
  strongTags: boolean;
}) => {
  const lastRef = useRef<HTMLDivElement>(null);

  const [phrases, setPhrases] = useState<PhraseFindManyResult>([]);
  const [phrasesChunk, setPhrasesChunk] = useState<PhraseFindManyResult>([]);
  const [restart, setRestart] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<OrderBy>();

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
      const _chunk = skip === 0 ? phrasesChunk : phrases.concat(phrasesChunk);
      setPhrases(_chunk);
      setPhrasesChunk([]);
    }
  }, [phrases, phrasesChunk, skip]);

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
        take: TAKE_PHRASES_DEFAULT.toString(),
        tags: tags.map((item) => item.id).join(','),
        strongTags: strongTags ? '1' : '0',
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
  }, [orderBy, skip, setLoad, tags, strongTags]);

  const onClickSortByDate = () => {
    const _orderBy = orderBy === 'asc' ? 'desc' : 'asc';
    setOrderBy(_orderBy);
    setLocalStorage(LocalStorageName.ORDER_BY, _orderBy);
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
        setSkip(skip + TAKE_PHRASES_DEFAULT);
      }
    });

    return () => {
      cleanSubs();
    };
  }, [count, phrases.length, skip, setSkip]);

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

export const useTags = () => {
  const [filterTags, setFilterTags] = useState<boolean>(false);
  const [allTags, setAllTags] = useState<TagFindManyResult>([]);
  const [skip, setSkip] = useState<number>(0);
  const [strongTags, setStrongTags] = useState(false);

  const { tags, onClickTagCheepWrapper, setTags } = useTagsGlobal({
    onChangeTags: () => {
      setSkip(0);
    },
  });

  /**
   * Clean tags
   */
  useEffect(() => {
    if (!filterTags) {
      setSkip(0);
      setTags([]);
    }
  }, [filterTags, setTags]);

  /**
   * Set tags
   */
  useEffect(() => {
    if (!filterTags) {
      return;
    }

    (async () => {
      const _tags = await request.tagFindMany();
      if (_tags.status !== 'info') {
        log(_tags.status, _tags.message, _tags, true);
        return;
      }
      setAllTags(_tags.data);
    })();
  }, [filterTags]);

  const changeStrongCb = () => {
    setSkip(0);
  };

  return {
    filterTags,
    setFilterTags,
    tags,
    onClickTagCheepWrapper,
    allTags,
    skip,
    setSkip,
    strongTags,
    setStrongTags,
    changeStrongCb,
  };
};
