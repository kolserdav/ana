import { GetStaticPropsContext } from 'next';
import AppBar from '../components/AppBar';
import { AppProps, PageFull } from '../types';
import { Locale, LocaleValue } from '../types/interfaces';
import { prepagePage } from '../utils/lib';
import Request from '../utils/request';
import s from '../styles/Page.module.scss';
import Translate from '../components/Translate';
import Head from '../components/Head';

const request = new Request();

interface PageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  localeCommon: Locale['app']['common'];
  localeTranslate: Locale['app']['translate'];
  page: PageFull;
}

export default function TranslatePage({
  app: { user, theme, connId },
  localeAppBar,
  page,
  localeTranslate,
  localeCommon,
}: PageProps) {
  return (
    <>
      <Head title={page.title} description={page.description} keywords={page.keywords} />
      <AppBar user={user} full theme={theme} locale={localeAppBar} />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Translate
          voiceNotFound={localeCommon.voiceNotFound}
          connId={connId}
          _edit={localeCommon.edit}
          _delete={localeCommon.delete}
          showHelp={localeCommon.showHelp}
          user={user}
          theme={theme}
          locale={localeTranslate}
          cancel={localeCommon.cancel}
          playSound={localeCommon.playSound}
          copyText={localeCommon.copyText}
        />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<PageProps, 'app'> }> {
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
