import { createRef, useRef } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import {
  Locale,
  LocaleValue,
  LocaleVars,
  UNDEFINED_QUERY_STRING,
  UserCleanResult,
} from '../types/interfaces';
import {
  useFilterByDate,
  useLangFilter,
  useMultiSelect,
  usePhraseDelete,
  usePhraseUpdate,
  usePhrases,
  usePlayAll,
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
  FIXED_TOOLS_HIGHT,
} from '../utils/constants';
import Input from './ui/Input';
import SearchIcon from './icons/Search';
import { getFormatDistance } from '../utils/lib';
import Select from './ui/Select';
import Spoiler from './ui/Spoiler';
import PlaySoundButton from './PlaySoundButton';
import PlayIcon from './icons/Play';
import PauseIcon from './icons/Pause';
import StopIcon from './icons/Stop';
import IconCheckbox from './ui/IconCheckbox';

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
}: {
  locale: Locale['app']['my'];
  theme: Theme;
  edit: string;
  _delete: string;
  cancel: string;
  user: UserCleanResult | null;
  voiceNotFound: string;
  playSound: string;
  changeLinkTo: string;
}) {
  const router = useRouter();
  const phrasesRef = useRef<HTMLDivElement>(null);
  const { load, setLoad } = useLoad();

  const { onClickPhraseUpdateWraper } = usePhraseUpdate();

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
  } = useTags();

  const { onChangeDateFilter, gt, date, resetFilterByDate } = useFilterByDate({ setSkip });

  const { langs, langFilter, onChangeLangsFilter, resetLangFilter } = useLangFilter({ setSkip });

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
  } = usePhraseDelete({
    setLoad,
    restart,
    setRestart,
    setSkip,
    selectedPhrases: selected,
    setSelected,
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

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography theme={theme} variant="h1" align="center">
          {locale.title}
        </Typography>
        <div className={s.global_filters}>
          <div className={s.global_filters__item}>
            <Select onChange={onChangeDateFilter} value={date} theme={theme}>
              <option value="all-time">{locale.forAllTime}</option>
              <option value="day">{locale.forDay}</option>
              <option value="week">{locale.forWeek}</option>
              <option value="month">{locale.forMonth}</option>
              <option value="three-months">{locale.forThreeMoths}</option>
              <option value="six-months">{locale.forSixMonths}</option>
              <option value="year">{locale.forYear}</option>
            </Select>
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
              <Typography small variant="span" theme={theme}>
                {`${locale.byUpdateDate}:`}
              </Typography>
              <IconButton theme={theme} onClick={onClickSortByDate}>
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
          <IconButton theme={theme} onClick={played ? onClickPauseAll : onClickPlayAll}>
            {played ? <PauseIcon color={theme.yellow} /> : <PlayIcon color={theme.green} />}
          </IconButton>
          <div className={s.played_phrase}>
            <div
              className={clsx(s.content, played ? s.animate : '')}
              style={{ animationDuration: `${animationDuration}s` }}
            >
              <Typography nowrap theme={theme} variant="span" disabled>
                {!played && !paused ? locale.playAll : playedText}
              </Typography>
            </div>
          </div>
          {(played || paused) && (
            <IconButton theme={theme} onClick={onClickStopAll}>
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
                    <IconButton title={locale.openTools} theme={theme} ref={ref}>
                      <DotsHorisontalIcon color={theme.text} />
                    </IconButton>

                    <Tooltip closeOnClick theme={theme} parentRef={ref} length={60}>
                      <div className={s.menu_tooltip}>
                        <IconButton
                          theme={theme}
                          title={edit}
                          onClick={onClickPhraseUpdateWraper(item)}
                        >
                          <EditIcon color={theme.blue} />
                        </IconButton>
                        <IconButton
                          theme={theme}
                          onClick={onClickDeletePhraseWrapper(item)}
                          title={_delete}
                        >
                          <DeleteIcon color={theme.red} />
                        </IconButton>
                        <IconCheckbox
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
                          <div className={s.play_button__container}>
                            <PlaySoundButton
                              theme={theme}
                              title={playSound}
                              text={item.text}
                              lang={item.learnLang}
                              voiceNotFound={voiceNotFound}
                              onStop={onStopPlayItem}
                              changeLinkTo={changeLinkTo}
                            />
                          </div>
                        </div>
                      </div>
                      {item.translate && (
                        <Typography className={s.translate} variant="p" theme={theme} small>
                          {item.translate}
                        </Typography>
                      )}
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
                    <div className={s.date}>
                      <Typography variant="span" theme={theme} small disabled>
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
          {`${locale.deletePhrase}?`}
        </Typography>
        <Typography variant="p" theme={theme}>
          {phraseToDelete?.text || ''}
        </Typography>
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
          {`${locale.deleteSelected}?`}
        </Typography>
        <Typography variant="p" theme={theme}>
          {locale.willDelete.replace(LocaleVars.count, selected.length.toString())}
        </Typography>
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
    </div>
  );
}

export default My;
