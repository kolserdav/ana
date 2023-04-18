import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import AppBar from '../components/AppBar';
import { AppProps, PageFull } from '../types';
import { Locale, LocaleValue } from '../types/interfaces';
import { prepagePage } from '../utils/lib';
import Request from '../utils/request';
import s from '../styles/Page.module.scss';
import Translate from '../components/Translate';

const request = new Request();

interface EmployerPageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  localeCommon: Locale['app']['common'];
  localeTranslate: Locale['app']['translate'];
  page: PageFull;
}

export default function TestPage({
  app: { user, theme },
  localeAppBar,
  page,
  localeTranslate,
  localeCommon,
}: EmployerPageProps) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar user={user} full theme={theme} locale={localeAppBar} />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Translate
          showHelp={localeCommon.showHelp}
          save={localeCommon.save}
          user={user}
          theme={theme}
          locale={localeTranslate}
        />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<EmployerPageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeTranslate = await request.getLocale({ field: 'translate', locale });
  const localeCommon = await request.getLocale({ field: 'common', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'translate',
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
      localeTranslate: localeTranslate.data,
      localeCommon: localeCommon.data,
    },
  };
}
