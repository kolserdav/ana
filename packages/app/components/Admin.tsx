import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale } from '../types/interfaces';
import { usePushNotifications } from './Admin.hooks';
import s from './Admin.module.scss';
import Hr from './ui/Hr';
import Typography from './ui/Typography';

function Admin({
  theme,
  title,
  locale,
}: {
  locale: Locale['app']['admin'];
  theme: Theme;
  title: string;
}) {
  const { setLoad } = useLoad();

  const { pushs } = usePushNotifications({ setLoad });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme} fullWidth align="center">
          {title}
        </Typography>
        <Hr theme={theme} />
        <Typography variant="h3" theme={theme}>
          {locale.pushNotifications}
        </Typography>
        <div className={s.pushs}>
          {pushs.map((item) => (
            <div key={item.id} className={s.pushs__item}>
              <div className={s.cell}>{item.title}</div>
              <div className={s.cell}>{item.description}</div>
              <div className={s.cell}>{item.lang}</div>
              <div className={s.cell}>{item.path}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
