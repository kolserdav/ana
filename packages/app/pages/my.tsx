import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import AppBar from '../components/AppBar';
import { AppProps, PageFull } from '../types';
import { Locale, LocaleValue } from '../types/interfaces';
import { prepagePage } from '../utils/lib';
import Request from '../utils/request';
import s from '../styles/Page.module.scss';
import My from '../components/My';
import useCloseAuth from '../hooks/useCloseAuth';

const request = new Request();

interface EmployerPageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  localeMy: Locale['app']['my'];
  localeCommon: Locale['app']['common'];
  page: PageFull;
}

export default function MyPage({
  app: { user, theme, userLoad },
  localeAppBar,
  page,
  localeMy,
  localeCommon,
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
        <My
          edit={localeCommon.edit}
          _delete={localeCommon.delete}
          locale={localeMy}
          user={user}
          theme={theme}
          cancel={localeCommon.cancel}
          save={localeCommon.save}
        />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<EmployerPageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeMy = await request.getLocale({ field: 'my', locale });
  const localeCommon = await request.getLocale({ field: 'common', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'my',
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
      localeMy: localeMy.data,
      localeCommon: localeCommon.data,
    },
  };
}
