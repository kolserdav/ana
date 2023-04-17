import clsx from 'clsx';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale } from '../types/interfaces';
import { useLanguages, useSpeechSynth, useTranslate } from './Translate.hooks';
import s from './Translate.module.scss';
import CloseIcon from './icons/Close';
import IconButton from './ui/IconButton';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Typography from './ui/Typography';
import VolumeHighIcon from './icons/VolumeHigh';

function Translate({ theme, locale }: { theme: Theme; locale: Locale['app']['translate'] }) {
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

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme} align="center">
          {locale.title}
        </Typography>
        <Typography variant="p" theme={theme}>
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
      </div>
    </div>
  );
}

export default Translate;
