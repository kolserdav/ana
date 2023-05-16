import HeadNext from 'next/head';
import { useEffect } from 'react';
import useLoad from '../hooks/useLoad';
import { DocumentProps } from '../types';
import AppBar from './AppBar';
import Head from './Head';
import s from './DocumentPage.module.scss';
import { ORIGIN } from '../utils/constants';
import useIsCanonical from '../hooks/useIsCanonical';
import Typography from './ui/Typography';
import { log } from '../utils/lib';

function DocumentPage({
  page: { title, keywords, description, content },
  app: { user, theme },
  localeAppBar,
}: DocumentProps) {
  useLoad();

  const { isCanonical } = useIsCanonical();

  /**
   * Check content
   */
  useEffect(() => {
    if (!title || !content) {
      log('error', 'Content of page is missing in database', { title, content });
    }
    if (!keywords || !description) {
      log('warn', 'Meta information is missing in database', { keywords, description });
    }
  }, [title, content, keywords, description]);

  return (
    <div className={s.wrapper} style={{ backgroundColor: theme.paper, color: theme.text }}>
      <HeadNext>
        <Head title={title} keywords={keywords} description={description} noIndex />
        {isCanonical && <link rel="canonical" href={`${ORIGIN}/policy`} />}
      </HeadNext>
      <AppBar user={user} theme={theme} locale={localeAppBar} full />
      <div className={s.container}>
        <div className={s.title}>
          <Typography theme={theme} variant="h1" align="center">
            {title}
          </Typography>
        </div>
        <div className={s.page__text} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default DocumentPage;
