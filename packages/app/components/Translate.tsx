import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale } from '../types/interfaces';
import { useLanguages, useTranslate } from './Translate.hooks';
import s from './Translate.module.scss';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Typography from './ui/Typography';

function Translate({ theme, locale }: { theme: Theme; locale: Locale['app']['translate'] }) {
  useLoad();
  const { langs, nativeLang, learnLang, changeLangWrapper } = useLanguages();
  const { translate, reTranslate, changeText } = useTranslate({ nativeLang, learnLang });

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
        <Textarea spellCheck={false} onInput={changeText} className={s.textarea} theme={theme} />
        <div style={{ color: theme.text }} className={s.native_res}>
          {translate}
        </div>
        <div style={{ color: theme.text }} className={s.learn_res}>
          {reTranslate}
        </div>
      </div>
    </div>
  );
}

export default Translate;
