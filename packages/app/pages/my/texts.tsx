import { GetStaticPropsContext } from 'next';
import AppBar from '../../components/AppBar';
import { AppProps, PageFull } from '../../types';
import { Locale, LocaleValue } from '../../types/interfaces';
import { prepagePage } from '../../utils/lib';
import Request from '../../utils/request';
import s from '../../styles/Page.module.scss';
import My from '../../components/My';
import useCloseAuth from '../../hooks/useCloseAuth';
import Head from '../../components/Head';

const request = new Request();

interface PageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  localeMy: Locale['app']['my'];
  localeCommon: Locale['app']['common'];
  page: PageFull;
}

export default function MyTextsPage({
  app: { user, theme, userLoad },
  localeAppBar,
  page,
  localeMy,
  localeCommon,
}: PageProps) {
  useCloseAuth({ user, userLoad });

  return (
    <>
      <Head title={page.title} description={page.description} keywords={page.keywords} noIndex />
      <AppBar user={user} theme={theme} locale={localeAppBar} full />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <My
          edit={localeCommon.edit}
          _delete={localeCommon.delete}
          locale={localeMy}
          user={user}
          theme={theme}
          cancel={localeCommon.cancel}
          playSound={localeCommon.playSound}
          voiceNotFound={localeCommon.voiceNotFound}
          dateFilter={localeCommon.dateFilter}
          sort={localeCommon.sort}
        />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<PageProps, 'app'> }> {
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
