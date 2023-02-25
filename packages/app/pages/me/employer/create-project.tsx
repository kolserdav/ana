import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import AppBar from '../../../components/AppBar';
import CreateProject from '../../../components/CreateProject';
import useCloseAuth from '../../../hooks/useCloseAuth';
import { AppProps, PageFull } from '../../../types';
import { Locale, LocaleValue } from '../../../types/interfaces';
import { prepagePage } from '../../../utils/lib';
import Request from '../../../utils/request';
import s from '../../../styles/Page.module.scss';

const request = new Request();

interface EmployerPageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  localeMeEmployer: Locale['app']['me'];
  localeCommon: Locale['app']['common'];
  page: PageFull;
}

export default function MeEmployerCreateProjectPage({
  app: { user, theme, userLoad, touchpad },
  localeAppBar,
  localeMeEmployer,
  localeCommon,
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
        <CreateProject
          showHelp={localeCommon.showHelp}
          touchpad={touchpad}
          locale={localeMeEmployer}
          formDesc={localeCommon.formDesc}
          theme={theme}
        />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<EmployerPageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeCommon = await request.getLocale({ field: 'common', locale });
  const localeMeEmployer = await request.getLocale({ field: 'me', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'meEmployerCreateProject',
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
      localeMeEmployer: localeMeEmployer.data,
      localeCommon: localeCommon.data,
    },
  };
}
