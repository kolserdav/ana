import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import AppBar from '../../components/AppBar';
import useCloseAuth from '../../hooks/useCloseAuth';
import { AppProps, PageFull } from '../../types';
import { Locale, LocaleValue } from '../../types/interfaces';
import { prepagePage } from '../../utils/lib';
import Request from '../../utils/request';
import Test from '../../components/Test';
import s from '../../styles/Page.module.scss';

const request = new Request();

interface EmployerPageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  page: PageFull;
}

export default function MeWorkerPage({
  app: { user, theme, userLoad },
  localeAppBar,
  page,
}: EmployerPageProps) {
  useCloseAuth({ user, userLoad });
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar user={user} theme={theme} locale={localeAppBar} full />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Test />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<EmployerPageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'meWorker',
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
