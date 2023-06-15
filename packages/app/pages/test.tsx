import { GetStaticPropsContext } from 'next';
import AppBar from '../components/AppBar';
import { AppProps, PageFull } from '../types';
import { Locale, LocaleValue } from '../types/interfaces';
import { prepagePage } from '../utils/lib';
import Request from '../utils/request';
import Test from '../components/Test';
import s from '../styles/Page.module.scss';
import Head from '../components/Head';

const request = new Request();

interface PageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  page: PageFull;
}

export default function TestPage({ app: { user, theme }, localeAppBar, page }: PageProps) {
  return (
    <>
      <Head title={page.title} description={page.description} keywords={page.keywords} />
      <AppBar user={user} theme={theme} locale={localeAppBar} />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Test />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<PageProps, 'app'> }> {
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
