import HeadNext from 'next/head';
import useLoad from '../hooks/useLoad';
import { DocumentProps } from '../types';
import AppBar from './AppBar';
import Head from './Head';
import s from './DocumentPage.module.scss';
import { ORIGIN } from '../utils/constants';
import useIsCanonical from '../hooks/useIsCanonical';

function DocumentPage({
  page: { title, keywords, description, content },
  app: { user, theme },
  localeAppBar,
}: DocumentProps) {
  useLoad();

  const { isCanonical } = useIsCanonical();

  return (
    <div className={s.wrapper} style={{ backgroundColor: theme.paper, color: theme.text }}>
      <HeadNext>
        <Head title={title} keywords={keywords} description={description} noIndex />
        {isCanonical && <link rel="canonical" href={`${ORIGIN}/policy`} />}
      </HeadNext>
      <AppBar user={user} theme={theme} locale={localeAppBar} full />
      <div className={s.container}>
        <h1 className={s.title}>{title}</h1>
        <div className={s.page__text} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default DocumentPage;
