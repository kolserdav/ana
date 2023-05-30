import clsx from 'clsx';
import { createRef, useRef } from 'react';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, UserCleanResult } from '../types/interfaces';
import {
  useLanguages,
  useRedirect,
  useSavePhrase,
  useSpeechRecognize,
  useTags,
  useTranslate,
  useUndo,
} from './Translate.hooks';
import s from './Translate.module.scss';
import CloseIcon from './icons/Close';
import IconButton from './ui/IconButton';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Typography from './ui/Typography';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Checkbox from './ui/Checkbox';
import Input from './ui/Input';
import HelpIcon from './icons/Help';
import Tooltip from './ui/Tooltip';
import Cheep from './ui/Cheep';
import EditIcon from './icons/Edit';
import DeleteIcon from './icons/Delete';
import SwapHorizontalIcon from './icons/SwapHorisontal';
import MicrophoneIcon from './icons/Microphone';
import UndoIcon from './icons/Undo';
import { PHRASE_MAX_LENGTH } from '../utils/constants';
import useSpeechSynth from '../hooks/useSpeechSynth';
import SpeakIcon from './ui/SpeakIcon';

function Translate({
  theme,
  locale,
  user,
  save,
  showHelp,
  _edit,
  _delete,
  cancel,
  connId,
  missingCSRF,
  voiceNotFound,
  playSound,
}: {
  theme: Theme;
  locale: Locale['app']['translate'];
  user: UserCleanResult | null;
  save: string;
  showHelp: string;
  _edit: string;
  _delete: string;
  cancel: string;
  connId: string | null;
  missingCSRF: string;
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
  } = useLanguages({ undo, setUndo, textareaRef, connId, user });

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
    missingCSRF,
    setUndo,
  });

  const { speechText, synthAllow, volumeIcon } = useSpeechSynth({
    text: reTranslate,
    voiceNotFound,
    lang: learnLang,
  });

  const {
    saveDialog,
    onClickSavePhrase,
    setSaveDialog,
    saveTranslate,
    setSaveTranslate,
    onClickSave,
    onClickUpdate,
  } = useSavePhrase({
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
  });

  const { onStartRecognize, onStopRecognize, allowRecogn } = useSpeechRecognize({
    setText,
    locale,
    learnLang,
  });

  const { loginRedirect } = useRedirect();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme} align="center">
          {edit ? locale.updatePhrase : locale.title}
        </Typography>

        {!edit && (
          <Typography variant="p" align="center" theme={theme}>
            {locale.description}
          </Typography>
        )}

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
            <IconButton onClick={onClickChangeLangs} title={locale.swapLangs}>
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
            ref={textareaRef}
            placeholder={load ? locale.serverIsNotConnected : locale.textareaPlaceholder}
            value={text}
            spellCheck={false}
            onInput={changeText}
            rows={rows}
            theme={theme}
            disabled={load}
            maxLength={PHRASE_MAX_LENGTH}
          />
          <div className={s.close_button}>
            <IconButton
              onClick={undo ? revertText : cleanText}
              title={edit ? locale.quitEdit : locale.cleanField}
              disabled={load}
            >
              {undo ? <UndoIcon color={theme.text} /> : <CloseIcon color={theme.text} />}
            </IconButton>
          </div>
          {allowRecogn && (
            <div className={s.micro_button} title={locale.startRecognize}>
              <IconButton
                disabled={load}
                onMouseUp={onStopRecognize}
                onMouseDown={onStartRecognize}
                onTouchStart={onStartRecognize}
                onTouchEnd={onStopRecognize}
              >
                <MicrophoneIcon color={theme.text} />
              </IconButton>
            </div>
          )}
        </div>
        <div style={{ color: theme.text }} className={s.native_res}>
          <Typography variant="p" theme={theme}>
            {translate}
          </Typography>
        </div>
        <div className={s.retrans_container}>
          <div
            role="button"
            tabIndex={-1}
            onKeyDown={onKeyDownReTranslate}
            onClick={onClickRetranslate}
            style={{ color: theme.text }}
            className={clsx(s.learn_res, reTranslate === text ? s.disabled : '')}
            title={locale.allowRecomend}
          >
            <Typography variant="p" theme={theme}>
              {reTranslate}
            </Typography>
          </div>
          {reTranslate && synthAllow && (
            <div className={s.sound_button}>
              <SpeakIcon
                onClick={speechText}
                title={playSound}
                volumeIcon={volumeIcon}
                theme={theme}
              />
            </div>
          )}
        </div>

        {reTranslate && (
          <div className={s.actions}>
            {user && (
              <>
                <div className={s.check_item}>
                  <Checkbox
                    disabled={load}
                    theme={theme}
                    label={locale.addTags}
                    id="add-tags"
                    checked={addTags}
                    onChange={setAddTags}
                  />
                </div>
                {addTags && (
                  <div className={s.tags} style={{ borderColor: theme.active }}>
                    <Typography className={s.title} variant="h4" theme={theme}>
                      {locale.tagsTitle}
                    </Typography>
                    <div className={s.input}>
                      <Input
                        type="text"
                        id="add-new-tag"
                        onChange={onChangeNewTag}
                        value={newTag}
                        name={tagToUpdate ? locale.changeTag : locale.newTag}
                        theme={theme}
                      />
                      <IconButton title={showHelp} ref={helpTagRef}>
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
                                  <IconButton title={_edit} onClick={onClickTagUpdateWrapper(item)}>
                                    <EditIcon color={theme.blue} />
                                  </IconButton>
                                  <IconButton
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
                  </div>
                )}
              </>
            )}
            <Button
              className={s.save_button}
              title={!user ? locale.needLogin : ''}
              disabled={load}
              theme={theme}
              onClick={user ? onClickSavePhrase : loginRedirect}
            >
              {edit ? locale.savePhrase : locale.createPhrase}
            </Button>
          </div>
        )}
      </div>
      {user && (
        <Dialog className={s.dialog} theme={theme} open={saveDialog} onClose={setSaveDialog}>
          <Typography align="center" theme={theme} variant="h2">
            {locale.savePhrase}
          </Typography>
          <Typography align="center" theme={theme} variant="h4">
            {locale.savePhraseDesc}
          </Typography>
          <div className={s.active} style={{ backgroundColor: theme.active }}>
            <Typography align="center" theme={theme} variant="p">
              {text}
            </Typography>
          </div>
          <div className={s.check_item}>
            <Checkbox
              theme={theme}
              label={locale.saveTranlsate}
              id="save-translate"
              checked={saveTranslate}
              onChange={setSaveTranslate}
            />
          </div>
          {saveTranslate && (
            <div className={s.active} style={{ backgroundColor: theme.active }}>
              <Typography align="center" theme={theme} variant="p">
                {translate}
              </Typography>
            </div>
          )}
          <div className={s.tags_created}>
            {tags.map((tag) => (
              <div key={tag.id} className={s.tag_item}>
                <Typography variant="span" theme={theme} small disabled>
                  {`#${tag.text}`}
                </Typography>
              </div>
            ))}
          </div>
          <div className={s.dialog_actions}>
            <Button theme={theme} onClick={edit ? onClickUpdate : onClickSave} disabled={load}>
              {save}
            </Button>
          </div>
        </Dialog>
      )}
      {user && (
        <Dialog
          className={s.dialog}
          onClose={setDeleteTagDialog}
          theme={theme}
          open={deleteTagDialog}
        >
          <Typography theme={theme} variant="h3">
            {`${locale.deleteTag}?`}
          </Typography>
          <Typography variant="p" theme={theme}>
            {tagToDelete?.text || ''}
          </Typography>
          <div className={s.actions}>
            <Button className={s.button} onClick={onClickCancelDeleteTag} theme={theme}>
              {cancel}
            </Button>
            <Button className={s.button} onClick={onClickDeleteTag} theme={theme}>
              {_delete}
            </Button>
          </div>
        </Dialog>
      )}
      <Tooltip theme={theme} parentRef={helpTagRef}>
        {locale.tagHelp}
      </Tooltip>
    </div>
  );
}

export default Translate;
