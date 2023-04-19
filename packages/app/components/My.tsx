import { createRef } from 'react';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, UserCleanResult } from '../types/interfaces';
import { usePhraseDelete, usePhraseUpdate, usePhrases } from './My.hooks';
import s from './My.module.scss';
import DeleteIcon from './icons/Delete';
import DotsHorisontalIcon from './icons/DotsHorisontal';
import EditIcon from './icons/Edit';
import IconButton from './ui/IconButton';
import Tooltip from './ui/Tooltip';
import Typography from './ui/Typography';
import Dialog from './ui/Dialog';
import Button from './ui/Button';

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

  const { phrases, restart, setRestart } = usePhrases();

  const {
    deletePhrase,
    setDeletePhrase,
    onClickDeletePhraseWrapper,
    phraseToDelete,
    onClickCloseDelete,
    onClickDeletePhrase,
  } = usePhraseDelete({ setLoad, restart, setRestart });

  const { onClickPhraseUpdateWraper } = usePhraseUpdate();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography theme={theme} variant="h1" align="center">
          {locale.title}
        </Typography>
        {phrases.map((item) => {
          const ref = createRef<HTMLButtonElement>();
          return (
            <div key={item.id} className={s.item_container}>
              <div className={s.actions}>
                <IconButton ref={ref}>
                  <DotsHorisontalIcon color={theme.text} />
                </IconButton>
                <Tooltip closeOnClick theme={theme} parent={ref} length={40}>
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
        })}
      </div>
      <Dialog className={s.dialog} theme={theme} onClose={setDeletePhrase} open={deletePhrase}>
        <Typography variant="h3" theme={theme} align="center">
          {locale.deletePhrase}?
        </Typography>
        <Typography variant="p" theme={theme}>
          {phraseToDelete?.text || ''}
        </Typography>
        <div className={s.actions}>
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
