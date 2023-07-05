import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  FullTag,
  Locale,
  LocaleValue,
  LocaleVars,
  OrderBy,
  PhraseFindManyResult,
  QUERY_STRING_ARRAY_SPLITTER,
  SEARCH_MIN_LENGTH,
  TagFindManyResult,
  UNDEFINED_QUERY_STRING,
  DateFilter,
  PhraseFindManyResultLight,
} from '../types/interfaces';
import Request from '../utils/request';
import { checkRouterPath, getFormatDistance, log } from '../utils/lib';
import {
  DATE_FILTER_ALL,
  LEARN_LANG_DEFAULT,
  ORDER_BY_DEFAULT,
  PLAY_ALL_ITEM_PAUSE,
  Pages,
  TAKE_ALL,
  TAKE_PHRASES_DEFAULT,
} from '../utils/constants';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import storeScroll from '../store/scroll';
import useTagsGlobal from '../hooks/useTags';
import {
  changeLinks,
  getAnimationDuration,
  getPlayButtonFromContainer,
  getPlayText,
  scrollTo,
  setMatchesBold,
} from './My.lib';
import useLangs from '../hooks/useLangs';
import useFixedTools from '../hooks/useFixedTools';
import useSpeechSynth from '../hooks/useSpeechSynth';

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
  learnLang,
  isTrash,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  tags: TagFindManyResult;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  skip: number;
  locale: Locale['app']['my'];
  tagsIsSet: boolean;
  strongTags: boolean;
  gt: string | undefined;
  learnLang: string | undefined;
  isTrash: boolean;
}) => {
  const router = useRouter();
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
    if (
      !orderBy ||
      !tagsIsSet ||
      (_search && _search.length < SEARCH_MIN_LENGTH) ||
      !learnLang ||
      !gt
    ) {
      return;
    }
    (async () => {
      setLoad(true);
      log('info', 'Phrase find many', { restart });
      const _phrases = await request.phraseFindMany({
        orderBy,
        skip: skip.toString(),
        take: TAKE_PHRASES_DEFAULT.toString(),
        tags: tags.map((item) => item.id).join(QUERY_STRING_ARRAY_SPLITTER),
        strongTags: strongTags ? '1' : '0',
        search: _search,
        gt,
        learnLang,
        isTrash: isTrash ? '1' : '0',
        light: '0',
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
  }, [
    orderBy,
    skip,
    setLoad,
    tags,
    strongTags,
    tagsIsSet,
    search,
    gt,
    learnLang,
    restart,
    isTrash,
  ]);

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
      const { innerHeight } = window;
      const { current } = lastRef;
      if (!current) {
        return;
      }
      const { bottom } = current.getBoundingClientRect();

      if (bottom < innerHeight && phrases.length < count && !_load) {
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

  const resetSearch = () => {
    setSearch('');
  };

  const sePieces = search.split(' ').filter((item) => item !== '');

  const _phrases = useMemo(
    () =>
      phrases.map((item) => {
        const _item = { ...item };
        _item.text = changeLinks(item.text);
        const isCreated = item.updated === item.created;
        _item.updated = getFormatDistance(item.updated, router.locale as LocaleValue) as any;
        if (isCreated) {
          _item.created = _item.updated;
        }
        if (sePieces.length !== 0) {
          _item.text = setMatchesBold({ text: _item.text, matches: sePieces });
          if (_item.translate) {
            _item.translate = setMatchesBold({ text: _item.translate, matches: sePieces });
          }
        }
        return _item;
      }),
    [phrases, sePieces, router.locale]
  );

  return {
    phrases: _phrases,
    setRestart,
    restart,
    orderBy,
    onClickSortByDate,
    lastRef,
    pagination,
    count,
    search,
    changeSearch,
    resetSearch,
  };
};

export const usePhraseDelete = ({
  setLoad,
  setRestart,
  restart,
  setSkip,
  selectedPhrases,
  setSelected,
  isTrash,
  restartGetTags,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  restart: boolean;
  selectedPhrases: string[];
  isTrash: boolean;
  restartGetTags: () => void;
}) => {
  const [deletePhrase, setDeletePhrase] = useState<boolean>(false);
  const [phraseToDelete, setPhraseToDelete] = useState<PhraseFindManyResult[0] | null>(null);
  const [deleteSelectedPhrases, setDeleteSelectedPhrases] = useState<boolean>(false);
  const [deleteImmediatly, setDeleteImmediatly] = useState<boolean>(false);
  const [emptyTrash, setEmptyTrash] = useState<boolean>(false);
  const [allInTrash, setAllInTrash] = useState<PhraseFindManyResultLight>([]);

  const onClickDeletePhraseWrapper = (phrase: PhraseFindManyResult[0]) => () => {
    setPhraseToDelete(phrase);
    setDeletePhrase(true);
  };

  const onClickOpenEmptyTrash = async () => {
    setEmptyTrash(true);
    const _phrases = await request.phraseFindMany({
      orderBy: 'asc',
      skip: '0',
      take: TAKE_ALL.toString(),
      tags: '',
      strongTags: '0',
      search: '',
      gt: DATE_FILTER_ALL,
      learnLang: '',
      isTrash: '1',
      light: '1',
    });
    if (_phrases.status !== 'info' || !_phrases.data) {
      log(_phrases.status, _phrases.message, _phrases, true);
      return;
    }

    setAllInTrash(_phrases.data);
  };

  const onClickCloseEmptyTrash = () => {
    setEmptyTrash(false);
  };

  const onClickEmptyTrash = async () => {
    setLoad(true);
    const delRes = await request.phraseDeleteMany({ phrases: allInTrash });
    setLoad(false);
    log(delRes.status, delRes.message, delRes, true);
    if (delRes.status !== 'info') {
      return;
    }
    restartGetTags();
    setEmptyTrash(false);
    setAllInTrash([]);
    setRestart(!restart);
  };

  const onClickCloseDelete = () => {
    setPhraseToDelete(null);
    setDeletePhrase(false);
    setDeleteImmediatly(false);
  };

  const onClickOpenDeleteSeleted = () => {
    setDeleteSelectedPhrases(true);
  };

  const onClickCloseDeleteSelected = () => {
    setDeleteSelectedPhrases(false);
    setDeleteImmediatly(false);
  };

  const onClickDeletePhrase = async () => {
    if (!phraseToDelete) {
      log('warn', 'Phrase to delete is missing', { phraseToDelete });
      return;
    }
    setLoad(true);
    if (isTrash || deleteImmediatly) {
      const delRes = await request.phraseDelete({ phraseId: phraseToDelete.id });
      setLoad(false);
      log(delRes.status, delRes.message, delRes, true);
      if (delRes.status !== 'info') {
        return;
      }
    } else {
      const delRes = await request.phraseUpdate({
        phraseId: phraseToDelete.id,
        data: { deleted: true },
      });
      setLoad(false);
      log(delRes.status, delRes.message, delRes, true);
      if (delRes.status !== 'info') {
        return;
      }
    }
    restartGetTags();
    setPhraseToDelete(null);
    setDeletePhrase(false);
    setDeleteImmediatly(false);
    setRestart(!restart);
    setSkip(0);
  };

  const onClickDeleteSelectedPhrases = async () => {
    setLoad(true);
    if (isTrash || deleteImmediatly) {
      const delRes = await request.phraseDeleteMany({ phrases: selectedPhrases });
      setLoad(false);
      log(delRes.status, delRes.message, delRes, true);
      if (delRes.status !== 'info') {
        return;
      }
    } else {
      const delRes = await request.phraseUpdateMany({
        phrases: selectedPhrases,
        data: { deleted: true },
      });
      setLoad(false);
      log(delRes.status, delRes.message, delRes, true);
      if (delRes.status !== 'info') {
        return;
      }
    }
    setRestart(!restart);
    setDeleteSelectedPhrases(false);
    setSelected([]);
    setDeleteImmediatly(false);
    setSkip(0);
  };

  return {
    deletePhrase,
    setDeletePhrase,
    onClickDeletePhraseWrapper,
    phraseToDelete,
    onClickCloseDelete,
    onClickDeletePhrase,
    deleteSelectedPhrases,
    setDeleteSelectedPhrases,
    onClickDeleteSelectedPhrases,
    onClickCloseDeleteSelected,
    onClickOpenDeleteSeleted,
    deleteImmediatly,
    setDeleteImmediatly,
    emptyTrash,
    onClickOpenEmptyTrash,
    onClickCloseEmptyTrash,
    onClickEmptyTrash,
    setEmptyTrash,
    allInTrash,
  };
};

export const usePhraseUpdate = () => {
  const router = useRouter();

  const onClickPhraseUpdateWraper = (phrase: PhraseFindManyResult[0]) => () => {
    router.push(`${Pages.translate}?edit=${phrase.id}`);
  };

  return { onClickPhraseUpdateWraper };
};

export const useTags = ({ isTrash, gt }: { isTrash: boolean; gt: string | undefined }) => {
  const [filterTags, setFilterTags] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [strongTags, setStrongTags] = useState<boolean>(false);
  const [tagsRestart, setTagsRestart] = useState<boolean>(false);

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

  const {
    tags,
    onClickTagCheepWrapper,
    setTags,
    allTags,
    tagsIsSet,
    alphaDesc,
    numericDesc,
    setCurrentSort,
  } = useTagsGlobal({
    onChangeTags: (_tags) => {
      setSkip(0);
      setLocalStorage(
        LocalStorageName.FILTER_TAGS,
        _tags.map((item) => item.id)
      );
    },
    deleted: isTrash,
    restart: tagsRestart,
    gt,
  });

  const restartGetTags = () => {
    setTagsRestart(!tagsRestart);
  };

  /**
   * Clean tags
   */
  useEffect(() => {
    if (!filterTags && tags.length > 0) {
      setSkip(0);
      setTags([]);
    }
  }, [filterTags, setTags, tags]);

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
    const val = !strongTags;
    setStrongTags(val);
    setLocalStorage(LocalStorageName.STRONG_FILTER, val);
    setSkip(0);
  };

  const resetTags = () => {
    setTags([]);
    setLocalStorage(LocalStorageName.FILTER_TAGS, []);
    setStrongTags(false);
    setFilterTags(false);
  };

  const onClickFilterTags = (val: boolean) => {
    setFilterTags(val);
    if (!val) {
      setLocalStorage(LocalStorageName.FILTER_TAGS, []);
    }
    if (strongTags && !val) {
      setStrongTags(false);
    }
  };

  return {
    filterTags,
    tags,
    onClickTagCheepWrapper,
    allTags,
    skip,
    setSkip,
    changeStrongCb,
    tagsIsSet,
    strongTags,
    setStrongTags,
    resetTags,
    onClickFilterTags,
    restartGetTags,
    alphaDesc,
    numericDesc,
    setCurrentSort,
  };
};

export const useLangFilter = ({
  setSkip,
  isTrash,
}: {
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  isTrash: boolean;
}) => {
  const [learnLangs, setLearnLangs] = useState<string[]>([]);
  const [langFilter, setLangFilter] = useState<string>();

  const { langs: _langs } = useLangs();

  /**
   * Set lang filter
   */
  useEffect(() => {
    const savedLang = getLocalStorage(LocalStorageName.FILTER_BY_LANG);
    setLangFilter(savedLang || UNDEFINED_QUERY_STRING);
  }, []);

  /**
   * Set learn langs
   */
  useEffect(() => {
    (async () => {
      const res = await request.phraseDistinct({
        distinct: ['learnLang'],
        isTrash: isTrash ? '1' : '0',
      });
      if (res.status !== 'info') {
        log(res.status, res.message, res);
        return;
      }
      setLearnLangs(res.data);
    })();
  }, [isTrash]);

  const langs = useMemo(
    () => _langs.filter((item) => learnLangs.includes(item.code)),
    [learnLangs, _langs]
  );

  const onChangeLangsFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;
    setLangFilter(value);
    setLocalStorage(LocalStorageName.FILTER_BY_LANG, value);
    setSkip(0);
  };

  const resetLangFilter = () => {
    setLangFilter(UNDEFINED_QUERY_STRING);
    setLocalStorage(LocalStorageName.FILTER_BY_LANG, UNDEFINED_QUERY_STRING);
  };

  return { langs, langFilter, onChangeLangsFilter, resetLangFilter };
};

export const useMultiSelect = ({ phrases }: { phrases: PhraseFindManyResult }) => {
  const selectedRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const onChangeSelectedWrapper = (phraseId: string) => () => {
    const _selected = selected.slice();
    const index = selected.indexOf(phraseId);
    if (index === -1) {
      _selected.push(phraseId);
    } else {
      _selected.splice(index, 1);
    }
    setSelected(_selected);
  };

  const { showAppBar, fixed: selectedFixed } = useFixedTools({ elementRef: selectedRef });

  const selectAll = () => {
    const _selected = phrases.map((item) => item.id);
    setSelected(_selected);
  };

  const unSelectAll = () => {
    setSelected([]);
  };

  const _selected = useMemo(
    () =>
      selected
        .map((item) => {
          const ph = phrases.find((_item) => _item.id === item);
          if (ph) {
            return item;
          }
          return undefined;
        })
        .filter((item) => item !== undefined) as string[],
    [selected, phrases]
  );

  return {
    selected: _selected,
    onChangeSelectedWrapper,
    selectedRef,
    selectedFixed,
    showAppBar,
    selectAll,
    unSelectAll,
    setSelected,
  };
};

export const useResetAllFilters = ({
  resetTags,
  tags,
  strongTags,
  langFilter,
  resetLangFilter,
  date,
  resetFilterByDate,
  search,
  resetSearch,
}: {
  resetTags: () => void;
  resetLangFilter: () => void;
  tags: TagFindManyResult;
  strongTags: boolean;
  langFilter: string | undefined;
  date: DateFilter | undefined;
  search: string;
  resetFilterByDate: () => void;
  resetSearch: () => void;
}) => {
  const [showResetFilters, setShowResetFilters] = useState<boolean>(false);

  const resetAllFilters = () => {
    resetTags();
    resetLangFilter();
    resetFilterByDate();
    resetSearch();
  };

  /**
   * Set show reset filters
   */
  useEffect(() => {
    let show = false;
    if (tags.length !== 0) {
      show = true;
    }
    if (strongTags) {
      show = true;
    }
    if (langFilter && langFilter !== UNDEFINED_QUERY_STRING) {
      show = true;
    }
    if (date && date !== DATE_FILTER_ALL) {
      show = true;
    }
    if (search !== '') {
      show = true;
    }
    setShowResetFilters(show);
  }, [tags, langFilter, strongTags, date, search]);

  return { resetAllFilters, showResetFilters };
};

export const usePlayAll = ({
  phrasesRef,
  selectedFixed,
}: {
  phrasesRef: React.RefObject<HTMLDivElement>;
  selectedFixed: boolean;
}) => {
  const playToolsRef = useRef<HTMLDivElement>(null);
  const [played, setPlayed] = useState<boolean>(false);
  const [currentPlay, setCurrentPlay] = useState<number>(0);
  const [playedText, setPlayedText] = useState<string>('');
  const [paused, setPaused] = useState<boolean>(false);
  const [animationDuration, setAnimationDuration] = useState<number>(0);

  const { fixed: playToolsFixed } = useFixedTools({ elementRef: playToolsRef });

  const stop = useCallback(() => {
    const { current } = phrasesRef;
    if (!current) {
      return;
    }
    const button = getPlayButtonFromContainer({ current, currentPlay });
    if (button && played) {
      button.click();
    }
    setPlayed(false);
    if (typeof androidCommon !== 'undefined') {
      androidCommon.setKeepScreenOn(false);
    }
  }, [currentPlay, phrasesRef, played]);

  const onClickStopAll = useCallback(() => {
    stop();
    setPaused(false);
    setCurrentPlay(0);

    const { current } = phrasesRef;
    if (!current) {
      return;
    }
    const button = getPlayButtonFromContainer({ current, currentPlay: 0 });
    if (button) {
      scrollTo({ element: button, selectedFixed });
    }
  }, [phrasesRef, stop, selectedFixed]);

  const onStopPlayItem = useCallback(
    (withoutPause = false) => {
      const { current } = phrasesRef;
      if (!current || !played) {
        return;
      }
      const nextPlay = currentPlay + 1;
      if (!current.children[nextPlay]) {
        onClickStopAll();
        return;
      }
      setTimeout(
        () => {
          setCurrentPlay(nextPlay);
        },
        withoutPause ? 0 : PLAY_ALL_ITEM_PAUSE
      );
    },
    [currentPlay, phrasesRef, onClickStopAll, played]
  );

  /**
   * Play current
   */
  useEffect(() => {
    const { current } = phrasesRef;
    if (!current || !played) {
      return;
    }
    const button = getPlayButtonFromContainer({ current, currentPlay });

    if (button) {
      scrollTo({ element: button, selectedFixed });
      button.click();

      const _playText = getPlayText({ current, currentPlay });
      if (_playText) {
        setPlayedText(_playText);
        setAnimationDuration(getAnimationDuration(_playText.length));
      }
    } else {
      onStopPlayItem(true);
    }
  }, [played, phrasesRef, currentPlay, onStopPlayItem, selectedFixed]);

  const onClickPlayAll = () => {
    setPlayed(true);
    setPaused(false);
    if (typeof androidCommon !== 'undefined') {
      androidCommon.setKeepScreenOn(true);
    }
  };

  const onClickPauseAll = () => {
    stop();
    setPaused(true);
  };

  return {
    onClickPlayAll,
    played,
    onStopPlayItem,
    onClickPauseAll,
    playToolsFixed,
    playToolsRef,
    onClickStopAll,
    playedText,
    paused,
    animationDuration,
  };
};

export interface PlayOnePhrase {
  id: string;
  text: string;
  lang: string;
}

export const usePlayOne = ({
  voiceNotFound,
  onStopPlayItem,
  changeLinkTo,
}: {
  voiceNotFound: string;
  onStopPlayItem: () => void;
  changeLinkTo: string;
}) => {
  const [forSpeech, setForSpeech] = useState<PlayOnePhrase | null>(null);
  const [ticker, setTicker] = useState<boolean>(false);

  const onStopPlayOne = () => {
    setForSpeech(null);
    onStopPlayItem();
    setTicker(false);
  };

  const { synthAllow, volumeIcon, speechText, stopSpeech } = useSpeechSynth({
    text: forSpeech?.text || '',
    voiceNotFound,
    lang: forSpeech?.lang || LEARN_LANG_DEFAULT,
    onStop: onStopPlayOne,
    changeLinkTo,
  });

  const clickForPlayWrapper = (data: PlayOnePhrase) => () => {
    let _ticker = true;
    if (forSpeech?.id === data.id) {
      stopSpeech();
      _ticker = false;
      setForSpeech(null);
    } else {
      setForSpeech(data);
    }
    setTicker(_ticker);
  };

  /**
   * Play phrase
   */
  useEffect(() => {
    if (!forSpeech) {
      return;
    }
    speechText();
  }, [forSpeech, speechText]);

  return { synthAllow, volumeIcon, speechText, clickForPlayWrapper, forSpeech, ticker };
};

export const useCheckPage = () => {
  const router = useRouter();

  const isTrash = checkRouterPath(router.asPath, Pages.trash);

  return { isTrash };
};
