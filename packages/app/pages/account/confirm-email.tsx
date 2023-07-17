import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import ConfirmEmail from '../../components/ConfirmEmail';
import AppBar from '../../components/AppBar';
import { AppProps, PageFull } from '../../types';
import { Locale, LocaleValue } from '../../types/interfaces';
import { prepagePage } from '../../utils/lib';
import Request from '../../utils/request';
import s from '../../styles/Page.module.scss';

const request = new Request();

interface ConfirmEmailProps extends AppProps {
  localeConfirm: Locale['app']['confirmEmail'];
  localeCommon: Locale['app']['common'];
  localeAppBar: Locale['app']['appBar'];
  page: PageFull;
}

export default function ConfirmEmailPage({
  app: { theme, user },
  localeConfirm,
  localeAppBar,
  localeCommon,
  page,
}: ConfirmEmailProps) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar theme={theme} locale={localeAppBar} withoutExpandLess user={user} />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <ConfirmEmail
          openInApp={localeCommon.openInApp}
          theme={theme}
          locale={localeConfirm}
          user={user}
        />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<ConfirmEmailProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeConfirm = await request.getLocale({ field: 'confirmEmail', locale });
  const localeCommon = await request.getLocale({ field: 'common', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'confirmEmail',
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
      localeConfirm: localeConfirm.data,
      localeAppBar: localeAppBar.data,
      localeCommon: localeCommon.data,
    },
  };
}
