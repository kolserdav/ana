import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale } from '../types/interfaces';
import { useLanguages, useTranslate } from './Translate.hooks';
import s from './Translate.module.scss';
import Select from './ui/Select';
import Textarea from './ui/Textarea';

function Translate({ theme, locale }: { theme: Theme; locale: Locale['app']['translate'] }) {
  useLoad();
  const { langs, nativeLang, learnLang, changeLangWrapper } = useLanguages();
  const { translate, reTranslate, changeText } = useTranslate({ nativeLang, learnLang });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <h1 className={s.title} style={{ color: theme.text }}>
          {locale.title}
        </h1>
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
        <Textarea onInput={changeText} className={s.textarea} theme={theme} />
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
