import clsx from 'clsx';
import { createRef, useRef } from 'react';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, UserCleanResult } from '../types/interfaces';
import {
  useCopyText,
  useLanguages,
  useRedirect,
  useSavePhrase,
  useSpeechRecognize,
  useTags,
  useTranslate,
  useUndo,
} from './Translate.hooks';
import s from './Translate.module.scss';
import p from '../styles/Page.module.scss';
import CloseIcon from './icons/Close';
import IconButton from './ui/IconButton';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Input from './ui/Input';
import HelpIcon from './icons/Help';
import Tooltip from './ui/Tooltip';
import Cheep from './ui/Cheep';
import EditIcon from './icons/Edit';
import DeleteIcon from './icons/Delete';
import SwapHorizontalIcon from './icons/SwapHorisontal';
import MicrophoneIcon from './icons/Microphone';
import UndoIcon from './icons/Undo';
import Spoiler from './ui/Spoiler';
import PlaySoundButton from './ui/PlaySoundButton';
import CopyIcon from './icons/Copy';
import createSelector from '../backend/createSelector';
import LoaderLine from './ui/LoaderLine';

function Translate({
  theme,
  locale,
  user,
  showHelp,
  _edit,
  _delete,
  cancel,
  connId,
  voiceNotFound,
  playSound,
  copyText,
}: {
  theme: Theme;
  locale: Locale['app']['translate'];
  copyText: Locale['app']['common']['copyText'];
  user: UserCleanResult | null;
  showHelp: string;
  _edit: string;
  _delete: string;
  cancel: string;
  connId: string | null;
  voiceNotFound: string;
  playSound: string;
}) {
  const helpTagRef = createRef<HTMLButtonElement>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { load, setLoad } = useLoad();

  const {
    onChangeNewTag,
    newTag,
    allTags,
    onClickTagCheepWrapper,
    tags,
    addTags,
    setAddTags,
    onClickAddTaggs,
    setTags,
    onClickTagDeleteWrapper,
    onClickTagUpdateWrapper,
    deleteTagDialog,
    tagToDelete,
    tagToUpdate,
    setDeleteTagDialog,
    onClickCancelDeleteTag,
    onClickDeleteTag,
    tagRestart,
    setTagRestart,
    onCloseTagUpdate,
  } = useTags({ setLoad });

  const { undo, setUndo } = useUndo();

  const {
    langs,
    nativeLang,
    learnLang,
    changeLangWrapper,
    changeLang,
    setChangeLang,
    setNativeLang,
    setLearnLang,
    onClickChangeLangs,
    text,
    setText,
    translate,
    setTranslate,
    oldText,
    setOldText,
  } = useLanguages({ undo, setUndo, connId, user });

  const {
    reTranslate,
    changeText,
    rows,
    cleanText,
    revertText,
    onKeyDownReTranslate,
    onClickRetranslate,
    edit,
    restart,
    setRestart,
    phraseSettings,
    translateLoad,
    reTranslateLoad,
  } = useTranslate({
    undo,
    nativeLang,
    learnLang,
    changeLang,
    setChangeLang,
    setNativeLang,
    setLearnLang,
    setTags,
    setAddTags,
    text,
    setText,
    translate,
    setTranslate,
    connId,
    setUndo,
    oldText,
    setOldText,
    textareaRef,
    user,
  });

  const { onClickSave, onClickUpdate } = useSavePhrase({
    translate,
    text,
    setLoad,
    setTags,
    tags,
    learnLang,
    nativeLang,
    edit,
    restart,
    setRestart,
    addTags,
    tagRestart,
    setTagRestart,
    reTranslate,
  });

  const { onStartRecognize, onStopRecognize, allowRecogn, speechRecognStarted } =
    useSpeechRecognize({
      setText,
      locale,
      learnLang,
    });

  const { loginRedirect } = useRedirect();

  const { onClickCopyTextWrapper } = useCopyText({ locale: copyText });

  if (typeof window === 'undefined') {
    createSelector({ type: 'textarea', value: s.textarea });
    createSelector({ type: 'translate', value: s.native_res });
    createSelector({ type: 'reTranslate', value: s.learn_res });
  }

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme} align="center" fullWidth>
          {edit ? locale.updatePhrase : locale.title}
        </Typography>
        <Typography variant="p" align="center" theme={theme} fullWidth>
          {edit ? locale.descEdit : locale.description}
        </Typography>
        <div className={s.selectors}>
          <Select
            onChange={changeLangWrapper('native')}
            value={nativeLang}
            aria-label={locale.nativeLang}
            theme={theme}
          >
            {langs.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </Select>
          <div className={s.swap_button}>
            <IconButton
              titleHide
              theme={theme}
              onClick={onClickChangeLangs}
              title={locale.swapLangs}
            >
              <SwapHorizontalIcon color={theme.text} />
            </IconButton>
          </div>
          <Select
            onChange={changeLangWrapper('learn')}
            value={learnLang}
            aria-label={locale.learnLang}
            theme={theme}
          >
            {langs.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div className={s.textarea}>
          <Textarea
            id={s.textarea}
            ref={textareaRef}
            placeholder={load ? locale.serverIsNotConnected : locale.textareaPlaceholder}
            value={text}
            spellCheck={false}
            onInput={changeText}
            rows={rows}
            theme={theme}
            disabled={load}
            maxLength={phraseSettings.maxSymbols}
          />
          <div className={s.close_button}>
            <IconButton
              titleHide
              theme={theme}
              onClick={undo ? revertText : cleanText}
              title={edit ? locale.quitEdit : undo ? locale.undo : locale.cleanField}
              disabled={load}
            >
              {undo ? <UndoIcon color={theme.text} /> : <CloseIcon color={theme.text} />}
            </IconButton>
          </div>
          <div className={s.micro_button} title={locale.startRecognize}>
            {text && (
              <div className={clsx(s.copy_button, allowRecogn ? s.copy_button__allow_recogn : '')}>
                <IconButton
                  titleHide
                  title={copyText.title}
                  theme={theme}
                  onClick={onClickCopyTextWrapper(text)}
                >
                  <CopyIcon color={theme.text} withoutScale />
                </IconButton>
                <div className={s.vert_margin} />
                <PlaySoundButton
                  titleHide
                  theme={theme}
                  title={playSound}
                  text={text}
                  lang={learnLang}
                  voiceNotFound={voiceNotFound}
                />
              </div>
            )}
            {allowRecogn && (
              <IconButton
                titleHide
                title={locale.startRecognize}
                theme={theme}
                disabled={load}
                onMouseUp={onStopRecognize}
                onMouseDown={onStartRecognize}
                onTouchStart={onStartRecognize}
                onTouchEnd={onStopRecognize}
                touchStarted={speechRecognStarted}
              >
                <MicrophoneIcon color={theme.text} />
              </IconButton>
            )}
          </div>
        </div>
        <div className={s.trans_container}>
          <div className={s.trans_container__result}>
            <div style={{ color: theme.text }} className={s.native_res}>
              <Typography variant="p" theme={theme} id={s.native_res}>
                {translate}
              </Typography>
            </div>
            {translate && (
              <div className={s.translate_actions}>
                <IconButton
                  titleHide
                  title={copyText.title}
                  theme={theme}
                  onClick={onClickCopyTextWrapper(translate)}
                >
                  <CopyIcon color={theme.text} withoutScale />
                </IconButton>
              </div>
            )}
          </div>
          <LoaderLine open={translateLoad} local color={theme.blue} slow />
        </div>
        <div className={s.trans_container}>
          <div className={s.trans_container__result}>
            <div
              role="button"
              tabIndex={-1}
              onKeyDown={onKeyDownReTranslate}
              onClick={onClickRetranslate}
              style={{ color: theme.text }}
              className={clsx(s.learn_res, reTranslate === text ? s.disabled : '')}
              title={locale.allowRecomend}
            >
              <Typography variant="p" theme={theme} id={s.learn_res}>
                {reTranslate}
              </Typography>
            </div>
            {reTranslate && (
              <div className={s.translate_actions}>
                <PlaySoundButton
                  titleHide
                  theme={theme}
                  title={playSound}
                  text={reTranslate}
                  lang={learnLang}
                  voiceNotFound={voiceNotFound}
                />
                <IconButton
                  titleHide
                  title={copyText.title}
                  theme={theme}
                  onClick={onClickCopyTextWrapper(reTranslate)}
                >
                  <CopyIcon color={theme.text} withoutScale />
                </IconButton>
              </div>
            )}
          </div>
          <LoaderLine open={reTranslateLoad} local color={theme.blue} slow />
        </div>

        {reTranslate && (
          <div className={s.actions}>
            {user && (
              <Spoiler
                className={s.tags_spoiler}
                theme={theme}
                summary={locale.addTags}
                setOpen={onClickAddTaggs}
                open={addTags}
              >
                <div
                  className={clsx(s.tags, addTags ? s.tags__open : '')}
                  style={{ borderColor: theme.active }}
                >
                  <Typography className={s.title} variant="h4" theme={theme}>
                    {locale.tagsTitle}
                  </Typography>
                  <div className={s.input}>
                    <Input
                      type="text"
                      id="add-new-tag"
                      onChange={onChangeNewTag}
                      value={newTag}
                      desc={tagToUpdate ? locale.changeTag : locale.newTag}
                      theme={theme}
                    />
                    {tagToUpdate && (
                      <IconButton
                        title={locale.closeUpdateTag}
                        titleHide
                        theme={theme}
                        onClick={onCloseTagUpdate}
                      >
                        <CloseIcon color={theme.text} />
                      </IconButton>
                    )}
                    <IconButton titleHide theme={theme} title={showHelp} ref={helpTagRef}>
                      <HelpIcon color={theme.text} />
                    </IconButton>
                  </div>
                  <div className={s.box}>
                    {tags.map((item) => (
                      <Cheep
                        postfix={item.PhraseTag.length.toString()}
                        key={item.id}
                        onClick={onClickTagCheepWrapper(item, 'del')}
                        add={false}
                        disabled={false}
                        theme={theme}
                      >
                        {item.text}
                      </Cheep>
                    ))}
                  </div>
                  <div className={s.box}>
                    {allTags.map((item) => (
                      <span key={item.id}>
                        {tags.findIndex((i) => i.id === item.id) === -1 && (
                          <Cheep
                            postfix={item.PhraseTag.length.toString()}
                            menuChildren={
                              <div className={s.menu_tooltip}>
                                <IconButton
                                  titleHide
                                  theme={theme}
                                  title={_edit}
                                  onClick={onClickTagUpdateWrapper(item)}
                                >
                                  <EditIcon color={theme.blue} />
                                </IconButton>
                                <IconButton
                                  titleHide
                                  theme={theme}
                                  onClick={onClickTagDeleteWrapper(item)}
                                  title={_delete}
                                >
                                  <DeleteIcon color={theme.red} />
                                </IconButton>
                              </div>
                            }
                            menuChildrenLength={30}
                            onClick={onClickTagCheepWrapper(item, 'add')}
                            add
                            theme={theme}
                          >
                            {item.text}
                          </Cheep>
                        )}
                      </span>
                    ))}
                  </div>
                  <Tooltip theme={theme} parentRef={helpTagRef}>
                    {locale.tagHelp}
                  </Tooltip>
                </div>
              </Spoiler>
            )}
            {!user && (
              <Typography align="center" theme={theme} variant="h4">
                {locale.savePhraseDesc}
              </Typography>
            )}
            <Button
              className={s.save_button}
              title={!user ? locale.needLogin : ''}
              disabled={load}
              theme={theme}
              onClick={user ? (edit ? onClickUpdate : onClickSave) : loginRedirect}
            >
              {edit ? locale.savePhrase : locale.createPhrase}
            </Button>
          </div>
        )}
      </div>
      {user && (
        <Dialog
          className={p.dialog}
          onClose={setDeleteTagDialog}
          theme={theme}
          open={deleteTagDialog}
        >
          <Typography theme={theme} variant="h3">
            {`${locale.deleteTag}?`}
          </Typography>
          <Typography variant="p" theme={theme} blur large>
            {tagToDelete?.text || ''}
          </Typography>
          {tagToDelete?.PhraseTag.length !== 0 && (
            <Typography theme={theme} variant="p">
              {`${locale.deleteTagDesc}: ${tagToDelete?.PhraseTag.length}`}
            </Typography>
          )}
          <div className={p.dialog__actions}>
            <Button className={p.button} onClick={onClickCancelDeleteTag} theme={theme}>
              {cancel}
            </Button>
            <Button className={p.button} onClick={onClickDeleteTag} theme={theme}>
              {_delete}
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default Translate;
