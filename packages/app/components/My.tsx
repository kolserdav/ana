import { createRef, useRef } from 'react';
import clsx from 'clsx';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, LocaleVars, UNDEFINED_QUERY_STRING, UserCleanResult } from '../types/interfaces';
import {
  useCheckPage,
  useLangFilter,
  useMultiSelect,
  usePhraseDelete,
  usePhraseUpdate,
  usePhrases,
  usePlayAll,
  usePlayOne,
  useResetAllFilters,
  useTags,
} from './My.hooks';
import s from './My.module.scss';
import p from '../styles/Page.module.scss';
import DeleteIcon from './icons/Delete';
import DotsHorisontalIcon from './icons/DotsHorisontal';
import EditIcon from './icons/Edit';
import IconButton from './ui/IconButton';
import Tooltip from './ui/Tooltip';
import Typography from './ui/Typography';
import Dialog from './ui/Dialog';
import Button from './ui/Button';
import FilterIcon from './icons/Filter';
import Checkbox from './ui/Checkbox';
import Cheep from './ui/Cheep';
import LoadIcon from './icons/LoadIcon';
import {
  APP_BAR_HEIGHT,
  APP_BAR_TRANSITION,
  DATA_TYPE_PHRASE,
  DATA_TYPE_PLAY_BUTTON,
  DATE_FILTER_ALL,
  FIXED_TOOLS_HIGHT,
} from '../utils/constants';
import Input from './ui/Input';
import SearchIcon from './icons/Search';
import Select from './ui/Select';
import Spoiler from './ui/Spoiler';
import PlayIcon from './icons/Play';
import PauseIcon from './icons/Pause';
import StopIcon from './icons/Stop';
import IconCheckbox from './ui/IconCheckbox';
import SpeakIcon from './ui/SpeakIcon';
import SelectDateFilter from './ui/SelectDateFilter';
import useFilterByDate from '../hooks/useFilterByDate';
import { LocalStorageName } from '../utils/localStorage';

function My({
  locale,
  theme,
  edit,
  _delete,
  cancel,
  user,
  playSound,
  voiceNotFound,
  changeLinkTo,
  dateFilter,
}: {
  locale: Locale['app']['my'];
  dateFilter: Locale['app']['common']['dateFilter'];
  theme: Theme;
  edit: string;
  _delete: string;
  cancel: string;
  user: UserCleanResult | null;
  voiceNotFound: string;
  playSound: string;
  changeLinkTo: string;
}) {
  const phrasesRef = useRef<HTMLDivElement>(null);
  const { load, setLoad } = useLoad();

  const { isTrash } = useCheckPage();

  const { onClickPhraseUpdateWraper } = usePhraseUpdate();

  const {
    onChangeDateFilter: _onChangeDateFilter,
    gt,
    date,
    resetFilterByDate,
  } = useFilterByDate({
    def: DATE_FILTER_ALL,
    localStorageName: isTrash
      ? LocalStorageName.FILTER_BY_DATE_TRASH
      : LocalStorageName.FILTER_BY_DATE,
  });

  const {
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
  } = useTags({ isTrash, gt });

  const onChangeDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    _onChangeDateFilter(e);
    setSkip(0);
  };

  const { langs, langFilter, onChangeLangsFilter, resetLangFilter } = useLangFilter({
    setSkip,
    isTrash,
  });

  const {
    phrases,
    restart,
    setRestart,
    orderBy,
    onClickSortByDate,
    lastRef,
    pagination,
    count,
    search,
    changeSearch,
    resetSearch,
  } = usePhrases({
    setLoad,
    tags,
    setSkip,
    skip,
    locale,
    tagsIsSet,
    strongTags,
    gt,
    learnLang: langFilter,
    isTrash,
  });

  const {
    selected,
    onChangeSelectedWrapper,
    selectedRef,
    selectedFixed,
    showAppBar,
    selectAll,
    unSelectAll,
    setSelected,
  } = useMultiSelect({ phrases });

  const {
    deletePhrase,
    setDeletePhrase,
    onClickDeletePhraseWrapper,
    phraseToDelete,
    onClickCloseDelete,
    onClickDeletePhrase,
    deleteSelectedPhrases,
    setDeleteSelectedPhrases,
    onClickCloseDeleteSelected,
    onClickOpenDeleteSeleted,
    onClickDeleteSelectedPhrases,
    deleteImmediatly,
    setDeleteImmediatly,
    emptyTrash,
    onClickCloseEmptyTrash,
    onClickEmptyTrash,
    setEmptyTrash,
    onClickOpenEmptyTrash,
    allInTrash,
  } = usePhraseDelete({
    setLoad,
    restart,
    setRestart,
    setSkip,
    selectedPhrases: selected,
    setSelected,
    isTrash,
    restartGetTags,
  });

  const { resetAllFilters, showResetFilters } = useResetAllFilters({
    resetTags,
    tags,
    strongTags,
    langFilter,
    date,
    search,
    resetLangFilter,
    resetFilterByDate,
    resetSearch,
  });

  const {
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
  } = usePlayAll({
    phrasesRef,
    selectedFixed: selected.length !== 0,
  });

  const playIsFixed = playToolsFixed && (played || paused);

  const { volumeIcon, clickForPlayWrapper, forSpeech, ticker } = usePlayOne({
    voiceNotFound,
    onStopPlayItem,
    changeLinkTo,
  });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.title}>
          <Typography theme={theme} variant="h1" align="center">
            {isTrash ? locale.trash : locale.title}
          </Typography>
          {isTrash && (
            <IconButton
              titleHide
              disabled={phrases.length === 0}
              onClick={onClickOpenEmptyTrash}
              theme={theme}
              title={locale.cleanTrash}
            >
              <DeleteIcon color={theme.red} />
            </IconButton>
          )}
        </div>
        <div className={s.global_filters}>
          <div className={s.global_filters__item}>
            <SelectDateFilter
              onChange={onChangeDateFilter}
              locale={dateFilter}
              date={date}
              theme={theme}
            />
          </div>
          {langs.length > 1 && (
            <div className={s.global_filters__item}>
              <Select onChange={onChangeLangsFilter} value={langFilter} theme={theme}>
                <option value={UNDEFINED_QUERY_STRING}>{locale.allLangs}</option>
                {langs.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
        <Spoiler
          theme={theme}
          className={s.filters_spoiler}
          setOpen={onClickFilterTags}
          open={filterTags}
          summary={locale.filterByTags}
        >
          <div
            className={clsx(s.filters, filterTags ? s.filters__open : '')}
            style={{ backgroundColor: theme.active }}
          >
            <div className={s.filters_tags}>
              {allTags.map((item) => (
                <span key={item.id}>
                  <Cheep
                    onClick={onClickTagCheepWrapper(
                      item,
                      tags.findIndex((i) => i.id === item.id) === -1 ? 'add' : 'del'
                    )}
                    postfix={item.PhraseTag.length.toString()}
                    add={tags.findIndex((i) => i.id === item.id) === -1}
                    disabled={item.PhraseTag.length === 0}
                    theme={theme}
                  >
                    {item.text}
                  </Cheep>
                </span>
              ))}
            </div>
            <Checkbox
              theme={theme}
              label={locale.strongAccord}
              id="filter-tags-strong"
              checked={strongTags}
              onChange={setStrongTags}
              cb={changeStrongCb}
            />
          </div>
        </Spoiler>
        <div className={s.search}>
          <Input
            type="text"
            desc={locale.minimalSearchLenght}
            theme={theme}
            value={search}
            classWrapper={s.input_wrapper}
            name={<SearchIcon withoutScale color={theme.text} />}
            id="search"
            onChange={changeSearch}
          />
          <div className={s.sorts}>
            <div className={s.sort_item}>
              <IconButton title={locale.byUpdateDate} theme={theme} onClick={onClickSortByDate}>
                <FilterIcon
                  withoutScale
                  className={orderBy === 'asc' ? s.asc : s.desc}
                  color={theme.text}
                />
              </IconButton>
            </div>
          </div>
        </div>
        <div className={s.reset_filters}>
          {showResetFilters && (
            <Button onClick={resetAllFilters} theme={theme}>
              {locale.resetAllFilters}
            </Button>
          )}
        </div>
        {phrases.length !== 0 && (
          <div className={s.pagination}>
            <Typography small theme={theme} variant="span">
              {pagination}
            </Typography>
          </div>
        )}
        <div ref={selectedRef} className={s.selected_container}>
          {selected.length !== 0 && (
            <div
              className={clsx(s.selected_items, selectedFixed ? s.selected_items__fixed : '')}
              style={{
                backgroundColor: theme.active,
                top: selectedFixed && showAppBar ? `${APP_BAR_HEIGHT}px` : 0,
                transition:
                  selectedFixed && showAppBar
                    ? `top ${APP_BAR_TRANSITION}s ease-out`
                    : `top ${APP_BAR_TRANSITION}s  ease-in`,
                borderColor: theme.text,
              }}
            >
              <IconCheckbox
                checked={phrases.length === selected.length}
                onClick={selectAll}
                theme={theme}
                title={locale.selectAll}
                label={`${locale.selectAll}: ${phrases.length - selected.length}`}
              />
              <IconCheckbox
                checked={phrases.length === selected.length}
                onClick={unSelectAll}
                theme={theme}
                title={locale.unselectAll}
                label={`${locale.unselectAll}: ${selected.length}`}
                minus
              />
              <IconButton
                theme={theme}
                onClick={onClickOpenDeleteSeleted}
                title={locale.deleteSelected}
              >
                <DeleteIcon color={theme.red} />
              </IconButton>
            </div>
          )}
        </div>
        <div
          ref={playToolsRef}
          className={clsx(
            s.selected_items,
            !playToolsFixed && selected.length !== 0 ? s.with_margin_bottom : '',
            playIsFixed ? s.selected_items__fixed : ''
          )}
          style={{
            backgroundColor: theme.active,
            top:
              playIsFixed && showAppBar
                ? `${selected.length !== 0 ? APP_BAR_HEIGHT + FIXED_TOOLS_HIGHT : APP_BAR_HEIGHT}px`
                : `${selected.length !== 0 ? FIXED_TOOLS_HIGHT : 0}px`,
            transition:
              playIsFixed && showAppBar
                ? `top ${APP_BAR_TRANSITION}s ease-out`
                : `top ${APP_BAR_TRANSITION}s  ease-in`,
            borderColor: theme.text,
          }}
        >
          <IconButton titleHide theme={theme} onClick={played ? onClickPauseAll : onClickPlayAll}>
            {played ? <PauseIcon color={theme.yellow} /> : <PlayIcon color={theme.green} />}
          </IconButton>
          <div className={s.played_phrase}>
            <div
              className={clsx(s.content, ticker ? s.animate : '')}
              style={{ animationDuration: `${animationDuration}s` }}
            >
              <Typography nowrap theme={theme} variant="span" disabled fullWidth>
                {!played && !paused ? locale.playAll : playedText}
              </Typography>
            </div>
          </div>
          {(played || paused) && (
            <IconButton titleHide theme={theme} onClick={onClickStopAll}>
              <StopIcon color={theme.red} />
            </IconButton>
          )}
        </div>
        <div ref={phrasesRef} className={s.phrases}>
          {phrases.length !== 0 ? (
            phrases.map((item, index) => {
              const ref = createRef<HTMLButtonElement>();
              return (
                <div
                  ref={phrases[index + 1] === undefined ? lastRef : undefined}
                  key={item.id}
                  className={s.item_container}
                >
                  <div className={s.actions}>
                    <IconButton titleHide title={locale.openTools} theme={theme} ref={ref}>
                      <DotsHorisontalIcon color={theme.text} />
                    </IconButton>

                    <Tooltip withoutClose closeOnClick theme={theme} parentRef={ref} length={100}>
                      <div className={s.menu_tooltip}>
                        <IconButton
                          titleHide
                          theme={theme}
                          title={edit}
                          onClick={onClickPhraseUpdateWraper(item)}
                        >
                          <EditIcon color={theme.blue} />
                        </IconButton>
                        <IconButton
                          titleHide
                          theme={theme}
                          onClick={onClickDeletePhraseWrapper(item)}
                          title={_delete}
                        >
                          <DeleteIcon color={theme.red} />
                        </IconButton>
                        <IconCheckbox
                          titleHide
                          checked={selected.indexOf(item.id) !== -1}
                          onClick={onChangeSelectedWrapper(item.id)}
                          theme={theme}
                          title={locale.selectPhrase}
                        />
                      </div>
                    </Tooltip>
                  </div>

                  <div className={s.item} style={{ borderColor: theme.active }}>
                    <div className={s.item__content}>
                      <div className={s.item__translate}>
                        <Typography datatype={DATA_TYPE_PHRASE} variant="p" theme={theme}>
                          {item.text}
                        </Typography>
                        <div className={s.play_button}>
                          <div
                            className={s.play_button__container}
                            datatype={DATA_TYPE_PLAY_BUTTON}
                          >
                            <SpeakIcon
                              titleHide
                              onClick={clickForPlayWrapper({
                                id: item.id,
                                text: item.text,
                                lang: item.learnLang,
                              })}
                              title={playSound}
                              volumeIcon={item.id === forSpeech?.id ? volumeIcon : 'high'}
                              theme={theme}
                            />
                          </div>
                        </div>
                      </div>
                      <details className={s.item__content__details}>
                        <summary>
                          <Typography variant="label" theme={theme} small>
                            {locale.translation}
                          </Typography>
                        </summary>
                        <Typography className={s.translate} variant="p" theme={theme} small>
                          {item.translate}
                        </Typography>
                      </details>
                      <details className={s.item__content__details}>
                        <summary className={clsx(item.text === item.reTranslate ? s.blur : '')}>
                          <Typography variant="label" theme={theme} small>
                            {locale.reTranslation}
                          </Typography>
                        </summary>
                        <Typography
                          className={s.translate}
                          variant="p"
                          theme={theme}
                          blur={item.text === item.reTranslate}
                          small
                        >
                          {item.reTranslate}
                        </Typography>
                      </details>
                    </div>
                    {selected.length !== 0 && (
                      <div className={s.item__selector}>
                        <IconCheckbox
                          checked={selected.indexOf(item.id) !== -1}
                          onClick={onChangeSelectedWrapper(item.id)}
                          theme={theme}
                          title={locale.selectPhrase}
                        />
                      </div>
                    )}
                  </div>

                  <div className={s.info}>
                    <div className={s.tags}>
                      {item.PhraseTag.map((tag) => (
                        <div key={tag.id} className={s.tag_item}>
                          <Typography variant="span" theme={theme} small disabled>
                            {`#${tag.Tag.text}`}
                          </Typography>
                        </div>
                      ))}
                    </div>
                    <div className={s.date} style={{ textShadow: `1px 1px 1px ${theme.text}` }}>
                      <Typography
                        variant="span"
                        theme={theme}
                        small
                        blur
                        styleName={item.updated === item.created ? 'info' : 'blue'}
                      >
                        {item.updated.toString()}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <span>
              {load ? (
                <LoadIcon color={theme.blue} />
              ) : (
                <Typography variant="p" theme={theme} align="center">
                  {locale.emptyPhrases}
                </Typography>
              )}
            </span>
          )}
          {phrases.length !== 0 && phrases.length === count && (
            <div className={clsx(s.pagination, s.bottom)}>
              <Typography small theme={theme} variant="span">
                {pagination}
              </Typography>
            </div>
          )}
        </div>
      </div>
      <Dialog className={p.dialog} theme={theme} onClose={setDeletePhrase} open={deletePhrase}>
        <Typography variant="h3" theme={theme} align="center">
          {`${isTrash || deleteImmediatly ? locale.deletePhrase : locale.moveToTrash}?`}
        </Typography>
        <Typography variant="p" theme={theme}>
          {phraseToDelete?.text || ''}
        </Typography>
        <div className={p.dialog__actions}>
          {!isTrash && (
            <Checkbox
              theme={theme}
              label={locale.deleteImmediatly}
              id="delete-immediatly"
              checked={deleteImmediatly}
              onChange={setDeleteImmediatly}
            />
          )}
        </div>
        <div className={p.dialog__actions}>
          <Button className={s.button} onClick={onClickCloseDelete} theme={theme}>
            {cancel}
          </Button>
          <div className={p.button_margin} />
          <Button className={s.button} onClick={onClickDeletePhrase} theme={theme}>
            {_delete}
          </Button>
        </div>
      </Dialog>
      <Dialog
        className={p.dialog}
        theme={theme}
        onClose={setDeleteSelectedPhrases}
        open={deleteSelectedPhrases}
      >
        <Typography variant="h3" theme={theme} align="center">
          {`${isTrash || deleteImmediatly ? locale.deleteSelected : locale.moveSelectedToTrash}?`}
        </Typography>
        <Typography variant="p" theme={theme}>
          {locale.willDelete.replace(LocaleVars.count, selected.length.toString())}
        </Typography>
        <div className={p.dialog__actions}>
          {!isTrash && (
            <Checkbox
              theme={theme}
              label={locale.deleteImmediatly}
              id="delete-all-immediatly"
              checked={deleteImmediatly}
              onChange={setDeleteImmediatly}
            />
          )}
        </div>
        <div className={p.dialog__actions}>
          <Button className={s.button} onClick={onClickCloseDeleteSelected} theme={theme}>
            {cancel}
          </Button>
          <div className={s.button_margin} />
          <Button className={s.button} onClick={onClickDeleteSelectedPhrases} theme={theme}>
            {_delete}
          </Button>
        </div>
      </Dialog>
      <Dialog className={p.dialog} theme={theme} onClose={setEmptyTrash} open={emptyTrash}>
        <Typography variant="h3" theme={theme} align="center">
          {`${locale.cleanTrash}?`}
        </Typography>
        <div className={p.dialog__actions}>
          {allInTrash.length !== 0 ? (
            <Typography variant="p" theme={theme}>
              {`${locale.cleanTrashDesc}: ${allInTrash.length}`}
            </Typography>
          ) : (
            <LoadIcon color={theme.blue} />
          )}
        </div>
        <div className={p.dialog__actions}>
          <Button className={s.button} onClick={onClickCloseEmptyTrash} theme={theme}>
            {cancel}
          </Button>
          <div className={s.button_margin} />
          <Button
            className={s.button}
            disabled={allInTrash.length === 0}
            onClick={onClickEmptyTrash}
            theme={theme}
          >
            {_delete}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default My;
