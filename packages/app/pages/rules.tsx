import HeadNext from 'next/head';
import type { GetServerSidePropsContext } from 'next';
import Request from '../utils/request';
import s from '../styles/DocumentPage.module.scss';
import Head from '../components/Head';
import { ORIGIN } from '../utils/constants';
import { prepagePage } from '../utils/lib';
import { DocumentProps } from '../types';
import useIsCanonical from '../hooks/useIsCanonical';

const request = new Request();

function RulesPage({ page: { title, content, keywords, description } }: DocumentProps) {
  const { isCanonical } = useIsCanonical();

  return (
    <div className={s.wrapper}>
      <HeadNext>
        {isCanonical && <link rel="canonical" href={`${ORIGIN}/rules`} />}
        <Head title={title} keywords={keywords} description={description} />
      </HeadNext>
      <div className={s.container}>
        <h1 className={s.title}>{title}</h1>
        <div className={s.page__text} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export async function getServerSideProps({
  locale: _locale,
}: GetServerSidePropsContext): Promise<{ props: Omit<DocumentProps, 'app'> }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'rules',
        },
        {
          lang: _locale === 'ru' ? _locale : 'en',
        },
      ],
    },
  });
  return {
    props: {
      page: prepagePage(page.data),
    },
  };
}

export default RulesPage;
