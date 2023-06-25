import { GetStaticPropsContext } from 'next';
import AppBar from '../../components/AppBar';
import { AppProps } from '../../types';
import { Locale } from '../../types/interfaces';
import Request from '../../utils/request';
import s from '../../styles/Page.module.scss';
import Head from '../../components/Head';
import Statistics from '../../components/Statistics';
import useCloseAuth from '../../hooks/useCloseAuth';

const request = new Request();

interface PageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  localeCommon: Locale['app']['common'];
  locale: Locale['app']['statistics'];
}

export default function StatisticsPage({
  app: { user, theme, userLoad },
  localeAppBar,
  locale,
  localeCommon,
}: PageProps) {
  useCloseAuth({ user, userLoad });

  return (
    <>
      <Head title={locale.title} />
      <AppBar user={user} theme={theme} locale={localeAppBar} full />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Statistics
          theme={theme}
          user={user}
          locale={locale}
          dateFilter={localeCommon.dateFilter}
        />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<PageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeStatistics = await request.getLocale({ field: 'statistics', locale });
  const localeCommon = await request.getLocale({ field: 'common', locale });
  return {
    props: {
      localeAppBar: localeAppBar.data,
      locale: localeStatistics.data,
      localeCommon: localeCommon.data,
    },
  };
}
