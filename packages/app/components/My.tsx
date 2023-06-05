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
import { APP_BAR_TRANSITION, TAKE_PHRASES_DEFAULT } from '../utils/constants';
import Input from './ui/Input';
import SearchIcon from './icons/Search';
import { setMatchesBold } from './Me.lib';
import { getFormatDistance } from '../utils/lib';
import Select from './ui/Select';

function My({
  locale,
  theme,
  edit,
  _delete,
  cancel,
  user,
}: {
  locale: Locale['app']['my'];
  theme: Theme;
  edit: string;
  _delete: string;
  cancel: string;
  user: UserCleanResult | null;
}) {
  const router = useRouter();
  const { load, setLoad } = useLoad();

  const { onClickPhraseUpdateWraper } = usePhraseUpdate();

  const {
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
  } = useTags();

  const { onChangeDateFilter, gt, date } = useFilterByDate({ setSkip });

  const { langs, langFilter, onChangeLangsFilter } = useLangFilter({ setSkip });

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

  const sePieces = search.split(' ');

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
        <div className={s.filters} style={{ backgroundColor: theme.active }}>
          <Checkbox
            theme={theme}
            label={locale.filterByTags}
            id="filter-tags"
            checked={filterTags}
            onChange={setFilterTags}
          />
          {filterTags && (
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
          )}
          {filterTags && (
            <Checkbox
              theme={theme}
              label={locale.strongAccord}
              id="filter-tags-strong"
              checked={strongTags}
              onChange={setStrongTags}
              cb={changeStrongCb}
            />
          )}
        </div>
        <div className={s.search}>
          <Input
            type="text"
            desc={locale.minimalSearchLenght}
            theme={theme}
            value={search}
            classWrapper={s.input_wrapper}
            name={<SearchIcon color={theme.text} />}
            id="search"
            onChange={changeSearch}
          />
          <div className={s.sorts}>
            <div className={s.sort_item}>
              <Typography small variant="span" theme={theme}>
                {`${locale.byUpdateDate}:`}
              </Typography>
              <IconButton onClick={onClickSortByDate}>
                <FilterIcon className={orderBy === 'asc' ? s.asc : s.desc} color={theme.text} />
              </IconButton>
            </div>
          </div>
        </div>
        <div className={s.phrases}>
          {phrases.length !== 0 && count > TAKE_PHRASES_DEFAULT && (
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
                  top: selectedFixed && showAppBar ? '60px' : 0,
                  transition:
                    selectedFixed && showAppBar
                      ? `top ${APP_BAR_TRANSITION}s ease-out`
                      : `top ${APP_BAR_TRANSITION}s  ease-in`,
                  borderColor: theme.text,
                }}
              >
                <Checkbox
                  id="select-all"
                  theme={theme}
                  checked={phrases.length === selected.length}
                  onChange={selectAll}
                  label={`${locale.selectAll}: ${phrases.length - selected.length}`}
                />
                <Checkbox
                  id="unselect-all"
                  theme={theme}
                  checked={phrases.length === selected.length}
                  onChange={unSelectAll}
                  indeterminate
                  label={`${locale.unselectAll}: ${selected.length}`}
                />
                <IconButton onClick={onClickOpenDeleteSeleted} title={locale.deleteSelected}>
                  <DeleteIcon color={theme.red} />
                </IconButton>
              </div>
            )}
          </div>
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
                    <IconButton aria-label={locale.byUpdateDate} ref={ref}>
                      <DotsHorisontalIcon color={theme.text} />
                    </IconButton>

                    <Tooltip closeOnClick theme={theme} parentRef={ref} length={40}>
                      <div className={s.menu_tooltip}>
                        <IconButton title={edit} onClick={onClickPhraseUpdateWraper(item)}>
                          <EditIcon color={theme.blue} />
                        </IconButton>
                        <IconButton onClick={onClickDeletePhraseWrapper(item)} title={_delete}>
                          <DeleteIcon color={theme.red} />
                        </IconButton>
                        {selected.length === 0 && (
                          <Checkbox
                            theme={theme}
                            id={`tooltip-check-${item.id}`}
                            onChange={onChangeSelectedWrapper(item.id)}
                            checked={selected.indexOf(item.id) !== -1}
                          />
                        )}
                      </div>
                    </Tooltip>
                  </div>

                  <div className={s.item} style={{ borderColor: theme.active }}>
                    <div className={s.item__content}>
                      <Typography variant="p" theme={theme}>
                        {sePieces.length === 0
                          ? item.text
                          : setMatchesBold({ text: item.text, matches: sePieces })}
                      </Typography>
                      {item.translate && (
                        <Typography className={s.translate} variant="p" theme={theme} small>
                          {sePieces.length === 0
                            ? item.translate
                            : setMatchesBold({ text: item.translate, matches: sePieces })}
                        </Typography>
                      )}
                    </div>
                    {selected.length !== 0 && (
                      <div className={s.item__selector}>
                        <Checkbox
                          theme={theme}
                          id={`card-check-${item.id}`}
                          onChange={onChangeSelectedWrapper(item.id)}
                          checked={selected.indexOf(item.id) !== -1}
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
                        {getFormatDistance(item.updated, router.locale as LocaleValue)}
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
          <div className={s.button_margin} />
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
