import clsx from 'clsx';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, UserCleanResult } from '../types/interfaces';
import { useLanguages, useSavePhrase, useSpeechSynth, useTranslate } from './Translate.hooks';
import s from './Translate.module.scss';
import CloseIcon from './icons/Close';
import IconButton from './ui/IconButton';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Typography from './ui/Typography';
import VolumeHighIcon from './icons/VolumeHigh';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Checkbox from './ui/Checkbox';

function Translate({
  theme,
  locale,
  user,
  save,
}: {
  theme: Theme;
  locale: Locale['app']['translate'];
  user: UserCleanResult;
  save: string;
}) {
  useLoad();
  const { langs, nativeLang, learnLang, changeLangWrapper, changeLang, setChangeLang } =
    useLanguages();
  const {
    translate,
    reTranslate,
    changeText,
    rows,
    cleanText,
    text,
    onKeyDownReTranslate,
    onClickRetranslate,
  } = useTranslate({
    nativeLang,
    learnLang,
    changeLang,
    setChangeLang,
  });

  const { speechRetranslate, synthAllow } = useSpeechSynth({
    reTranslate,
    locale,
    learnLang,
  });

  const { saveDialog, onClickSavePhrase, setSaveDialog, saveTranslate, setSaveTranslate } =
    useSavePhrase({
      translate,
      learnLang,
      text,
    });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme} align="center">
          {locale.title}
        </Typography>
        <Typography variant="p" align="center" theme={theme}>
          {locale.description}
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
            value={text}
            spellCheck={false}
            onInput={changeText}
            rows={rows}
            theme={theme}
          />
          <div className={s.close_button}>
            <IconButton onClick={cleanText}>
              <CloseIcon color={theme.text} />
            </IconButton>
          </div>
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
              <IconButton onClick={speechRetranslate}>
                <VolumeHighIcon color={theme.text} />
              </IconButton>
            </div>
          )}
        </div>
        {reTranslate && (
          <div className={s.actions}>
            <Button
              title={!user ? locale.needLogin : ''}
              disabled={!user}
              theme={theme}
              onClick={onClickSavePhrase}
            >
              {locale.savePhrase}
            </Button>
          </div>
        )}
      </div>
      <Dialog theme={theme} open={saveDialog} onClose={setSaveDialog}>
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
        <Checkbox
          theme={theme}
          label={locale.saveTranlsate}
          id="save-translate"
          checked={saveTranslate}
          onChange={setSaveTranslate}
        />
        {saveTranslate && (
          <div className={s.active} style={{ backgroundColor: theme.active }}>
            <Typography align="center" theme={theme} variant="p">
              {translate}
            </Typography>
          </div>
        )}
        <div className={s.actions}>
          <Button
            theme={theme}
            onClick={() => {
              /** */
            }}
          >
            {save}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default Translate;
