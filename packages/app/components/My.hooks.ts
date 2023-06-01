import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  FullTag,
  Locale,
  LocaleVars,
  OrderBy,
  PhraseFindManyResult,
  SEARCH_MIN_LENGTH,
  TagFindManyResult,
} from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';
import { ORDER_BY_DEFAULT, Pages, TAKE_PHRASES_DEFAULT } from '../utils/constants';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import storeScroll from '../store/scroll';
import useTagsGlobal from '../hooks/useTags';
import { DateFilter } from '../types';
import { getGTDate } from './Me.lib';

const request = new Request();

let _load = false;

export const usePhrases = ({
  setLoad,
  tags,
  setSkip,
  skip,
  locale,
  tagsIsSet,
  strongTags,
  gt,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  tags: TagFindManyResult;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  skip: number;
  locale: Locale['app']['my'];
  tagsIsSet: boolean;
  strongTags: boolean;
  gt: string;
}) => {
  const lastRef = useRef<HTMLDivElement>(null);

  const [phrases, setPhrases] = useState<PhraseFindManyResult>([]);
  const [phrasesChunk, setPhrasesChunk] = useState<PhraseFindManyResult>([]);
  const [restart, setRestart] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<OrderBy>();

  const [count, setCount] = useState<number>(0);

  const [search, setSearch] = useState<string>('');

  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    if (skip !== 0) {
      setSkip(0);
    }
    setSearch(value);
  };

  /**
   * Save strong tags
   */
  useEffect(() => {
    setLocalStorage(LocalStorageName.STRONG_FILTER, strongTags);
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
    const _search = search?.trim();
    if (!orderBy || !tagsIsSet || (_search && _search.length < SEARCH_MIN_LENGTH)) {
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
        search: _search,
        gt,
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
  }, [orderBy, skip, setLoad, tags, strongTags, tagsIsSet, search, gt]);

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
    pagination,
    count,
    search,
    changeSearch,
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
  const [skip, setSkip] = useState<number>(0);
  const [strongTags, setStrongTags] = useState<boolean>(false);

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

  const { tags, onClickTagCheepWrapper, setTags, allTags, tagsIsSet } = useTagsGlobal({
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
   * Check filter tags
   */
  useEffect(() => {
    if (!filterTags && strongTags) {
      setFilterTags(true);
    }
  }, [filterTags, strongTags]);

  /**
   * Set filter tags
   */
  useEffect(() => {
    if (!tagsIsSet) {
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
  }, [allTags, setTags, tagsIsSet]);

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
    strongTags,
    setStrongTags,
  };
};

export const useFilterByDate = ({
  setSkip,
}: {
  setSkip: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [date, setDate] = useState<DateFilter>('all-time');
  const [gt, setGT] = useState<string>('');

  const onChangeDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;
    setDate(value as DateFilter);
    setSkip(0);
  };

  /**
   * Set lt
   */
  useEffect(() => {
    setGT(getGTDate(date));
  }, [date]);

  return { gt, onChangeDateFilter, date };
};
