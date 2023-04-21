import { createRef } from 'react';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, LocaleVars, UserCleanResult } from '../types/interfaces';
import { usePhraseDelete, usePhraseUpdate, usePhrases, useTags } from './My.hooks';
import s from './My.module.scss';
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
import { TAKE_PHRASES_DEFAULT } from '../utils/constants';

function My({
  locale,
  theme,
  user,
  edit,
  save,
  _delete,
  cancel,
}: {
  locale: Locale['app']['my'];
  theme: Theme;
  user: UserCleanResult;
  edit: string;
  _delete: string;
  save: string;
  cancel: string;
}) {
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
  } = useTags();

  const {
    phrases,
    restart,
    setRestart,
    orderBy,
    onClickSortByDate,
    lastRef,
    strongTags,
    setStrongTags,
    pagination,
    count,
  } = usePhrases({
    setLoad,
    tags,
    setSkip,
    skip,
    locale,
    tagsIsSet,
  });

  const {
    deletePhrase,
    setDeletePhrase,
    onClickDeletePhraseWrapper,
    phraseToDelete,
    onClickCloseDelete,
    onClickDeletePhrase,
  } = usePhraseDelete({ setLoad, restart, setRestart });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography theme={theme} variant="h1" align="center">
          {locale.title}
        </Typography>
        <div className={s.sorts}>
          <div className={s.sort_item}>
            <Typography small variant="span" theme={theme}>
              {locale.byUpdateDate}:
            </Typography>
            <IconButton onClick={onClickSortByDate}>
              <FilterIcon className={orderBy === 'asc' ? s.asc : s.desc} color={theme.text} />
            </IconButton>
          </div>
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

        <div className={s.phrases}>
          {phrases.length !== 0 && count > TAKE_PHRASES_DEFAULT && (
            <div className={s.pagination}>
              <Typography small theme={theme} variant="span">
                {pagination}
              </Typography>
            </div>
          )}
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
                      </div>
                    </Tooltip>
                  </div>
                  <div className={s.item} style={{ borderColor: theme.active }}>
                    <Typography variant="p" theme={theme}>
                      {item.text}
                    </Typography>
                    {item.translate && (
                      <Typography className={s.translate} variant="p" theme={theme} small>
                        {item.translate}
                      </Typography>
                    )}
                  </div>
                  <div className={s.tags}>
                    {item.PhraseTag.map((tag) => (
                      <div key={tag.id} className={s.tag_item}>
                        <Typography variant="span" theme={theme} small disabled>
                          #{tag.Tag.text}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <Typography variant="p" theme={theme} align="center">
              {load ? <LoadIcon color={theme.blue} /> : locale.emptyPhrases}
            </Typography>
          )}
          {phrases.length !== 0 && phrases.length === count && (
            <div className={s.pagination}>
              <Typography small theme={theme} variant="span">
                {pagination}
              </Typography>
            </div>
          )}
        </div>
      </div>
      <Dialog className={s.dialog} theme={theme} onClose={setDeletePhrase} open={deletePhrase}>
        <Typography variant="h3" theme={theme} align="center">
          {locale.deletePhrase}?
        </Typography>
        <Typography variant="p" theme={theme}>
          {phraseToDelete?.text || ''}
        </Typography>
        <div className={s.dialog__actions}>
          <Button className={s.button} onClick={onClickCloseDelete} theme={theme}>
            {cancel}
          </Button>
          <Button className={s.button} onClick={onClickDeletePhrase} theme={theme}>
            {_delete}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default My;
