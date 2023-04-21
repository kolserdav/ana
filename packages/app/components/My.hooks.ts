import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  FullTag,
  Locale,
  LocaleVars,
  OrderBy,
  PhraseFindManyResult,
  TagFindManyResult,
} from '../types/interfaces';
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
  locale,
  tagsIsSet,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  tags: TagFindManyResult;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  skip: number;
  locale: Locale['app']['my'];
  tagsIsSet: boolean;
}) => {
  const lastRef = useRef<HTMLDivElement>(null);

  const [phrases, setPhrases] = useState<PhraseFindManyResult>([]);
  const [phrasesChunk, setPhrasesChunk] = useState<PhraseFindManyResult>([]);
  const [restart, setRestart] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<OrderBy>();
  const [strongTags, setStrongTags] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  /**
   * Set saved strong tags
   */
  useEffect(() => {
    const _strongTags = getLocalStorage(LocalStorageName.STRONG_FILTER);
    if (_strongTags !== null) {
      setStrongTags(_strongTags);
    } else {
      setStrongTags(false);
    }
  }, []);

  /**
   * Save strong tags
   */
  useEffect(() => {
    const _strongTags = getLocalStorage(LocalStorageName.STRONG_FILTER);
    if (_strongTags !== strongTags && strongTags) {
      setLocalStorage(LocalStorageName.STRONG_FILTER, strongTags);
    }
  }, [strongTags]);

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
    if (!orderBy || !tagsIsSet) {
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

      if (_phrases.data.length === 0 && skip === 0) {
        setPhrases([]);
      }

      setTimeout(() => {
        _load = false;
      }, 0);
    })();
  }, [orderBy, skip, setLoad, tags, strongTags, tagsIsSet]);

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

  const pagination = useMemo(
    () =>
      locale.pagination
        .replace(LocaleVars.show, phrases.length.toString())
        .replace(LocaleVars.all, count.toString()),
    [locale.pagination, phrases, count]
  );

  return {
    phrases,
    setRestart,
    restart,
    orderBy,
    onClickSortByDate,
    lastRef,
    strongTags,
    setStrongTags,
    pagination,
    count,
  };
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
  const [tagsIsSet, setTagsIsSet] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);

  const { tags, onClickTagCheepWrapper, setTags, allTags } = useTagsGlobal({
    onChangeTags: (_tags) => {
      setSkip(0);
      setLocalStorage(
        LocalStorageName.FILTER_TAGS,
        _tags.map((item) => item.id)
      );
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
   * Set filter tags
   */
  useEffect(() => {
    if (allTags.length === 0) {
      return;
    }

    const savedTags = getLocalStorage(LocalStorageName.FILTER_TAGS);
    if (savedTags?.length) {
      const _tags = savedTags
        .map((item) => allTags.find((_item) => _item.id === item))
        .filter((item) => item !== undefined) as FullTag[];

      if (_tags.length) {
        setTags(_tags);
        setFilterTags(true);
      }
    }
    setTagsIsSet(true);
  }, [allTags, setTags]);

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
    changeStrongCb,
    tagsIsSet,
  };
};
