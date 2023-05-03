import HeadNext from 'next/head';
import type { GetServerSidePropsContext } from 'next';
import Request from '../utils/request';
import s from '../styles/DocumentPage.module.scss';
import Head from '../components/Head';
import { prepagePage } from '../utils/lib';
import { DocumentProps } from '../types';

const request = new Request();

function ContactsPage({ page: { title, keywords, description, content } }: DocumentProps) {
  return (
    <div className={s.wrapper}>
      <HeadNext>
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
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'contacts',
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

export default ContactsPage;
