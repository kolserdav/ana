import { GetStaticPropsContext } from 'next';
import AppBar from '../components/AppBar';
import { AppProps, PageFull } from '../types';
import { Locale, LocaleValue } from '../types/interfaces';
import { prepagePage } from '../utils/lib';
import Request from '../utils/request';
import s from '../styles/Page.module.scss';
import Head from '../components/Head';
import Settings from '../components/Settings';

const request = new Request();

interface EmployerPageProps extends AppProps {
  localeSettings: Locale['app']['settings'];
  localeAppBar: Locale['app']['appBar'];
  page: PageFull;
}

export default function SettingsPage({
  app: { user, theme },
  localeSettings,
  localeAppBar,
  page,
}: EmployerPageProps) {
  return (
    <>
      <Head title={page.title} description={page.description} keywords={page.keywords} />
      <AppBar user={user} theme={theme} locale={localeAppBar} />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Settings user={user} locale={localeSettings} theme={theme} />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<EmployerPageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeSettings = await request.getLocale({ field: 'settings', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'settings',
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
      localeSettings: localeSettings.data,
    },
  };
}
