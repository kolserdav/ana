import ConfirmEmail from '@/components/ConfirmEmail';
import AppBar from '@/components/ui/AppBar';
import { AppProps, PageFull } from '@/types';
import { Locale, LocaleValue } from '@/types/interfaces';
import { prepagePage } from '@/utils/lib';
import Request from '@/utils/request';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import s from '../../styles/Page.module.scss';

const request = new Request();

interface ConfirmEmailProps extends AppProps {
  localeConfirm: Locale['app']['confirmEmail'];
  localeAppBar: Locale['app']['appBar'];
  page: PageFull;
}

export default function ConfirmEmailPage({
  app: { theme },
  localeConfirm,
  localeAppBar,
  page,
}: ConfirmEmailProps) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar theme={theme} locale={localeAppBar} withoutExpandLess />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <ConfirmEmail theme={theme} locale={localeConfirm} />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<ConfirmEmailProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeConfirm = await request.getLocale({ field: 'confirmEmail', locale });
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
    },
  };
}
