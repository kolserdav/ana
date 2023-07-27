import { GetStaticPropsContext } from 'next';
import AppBar from '../../components/AppBar';
import { AppProps, PageFull } from '../../types';
import { Locale, LocaleValue } from '../../types/interfaces';
import { prepagePage } from '../../utils/lib';
import Request from '../../utils/request';
import s from '../../styles/Page.module.scss';
import Admin from '../../components/Admin';
import Head from '../../components/Head';
import useCloseRole from '../../hooks/useCloseRole';

const request = new Request();

interface PageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  localeAdmin: Locale['app']['admin'];
  page: PageFull;
}

export default function AdminPage({
  app: { user, theme, userLoad },
  localeAppBar,
  page,
  localeAdmin,
}: PageProps) {
  useCloseRole({ user, userLoad, whiteList: ['admin'] });
  return (
    <>
      <Head title={page.title} description={page.description} keywords={page.keywords} />
      <AppBar user={user} full theme={theme} locale={localeAppBar} />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Admin title={page.title} theme={theme} locale={localeAdmin} />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<PageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeAdmin = await request.getLocale({ field: 'admin', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'admin',
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
      localeAdmin: localeAdmin.data,
    },
  };
}
