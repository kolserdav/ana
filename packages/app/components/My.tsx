import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, UserCleanResult } from '../types/interfaces';
import { usePhrases } from './My.hooks';
import s from './My.module.scss';
import Typography from './ui/Typography';

function My({
  locale,
  theme,
  user,
}: {
  locale: Locale['app']['my'];
  theme: Theme;
  user: UserCleanResult;
}) {
  useLoad();

  const { phrases } = usePhrases();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography theme={theme} variant="h1" align="center">
          {locale.title}
        </Typography>
        {phrases.map((item) => (
          <div key={item.id} className={s.item_container}>
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
        ))}
      </div>
    </div>
  );
}

export default My;
