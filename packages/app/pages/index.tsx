import Head from 'next/head';
import { GetStaticPropsContext } from 'next';
import Request from '../utils/request';
import { Locale, LocaleValue } from '../types/interfaces';
import { AppProps, PageFull } from '../types';
import { prepagePage } from '../utils/lib';
import s from '../styles/Page.module.scss';
import Home from '../components/Home';
import AppBar from '../components/AppBar';

const request = new Request();

interface LoginProps extends AppProps {
  page: PageFull;
  localeAppBar: Locale['app']['appBar'];
}

export default function HomePage({ page, app: { theme, user }, localeAppBar }: LoginProps) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar locale={localeAppBar} theme={theme} user={user} full />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Home />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<LoginProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'index',
        },
        {
          lang: locale as LocaleValue,
        },
      ],
    },
  });

  return {
    props: {
      page: prepagePage(page.data),
      localeAppBar: localeAppBar.data,
    },
  };
}
