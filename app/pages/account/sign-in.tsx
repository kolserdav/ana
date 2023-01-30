import Head from 'next/head';
import s from '@/styles/Home.module.scss';
import Login from '@/components/Login';
import useTheme from '@/hooks/useTheme';
import { GetStaticPropsContext } from 'next';
import Request from '@/utils/request';
import { LocaleValue, Locale } from '@/types/interfaces';
import { PageFull } from '@/types';
import { prepagePage } from '@/utils/lib';
import AppBar from '@/components/ui/AppBar';

const request = new Request();

interface LoginProps {
  localeLogin: Locale['app']['login'];
  localeAppBar: Locale['app']['appBar'];
  page: PageFull;
}

export default function HomePage({ localeLogin, page, localeAppBar }: LoginProps) {
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar theme={theme} withoutExpandLess locale={localeAppBar} />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Login theme={theme} locale={localeLogin} />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: LoginProps }> {
  const localeLogin = await request.getLocale({ field: 'login', locale });
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'login',
        },
        {
          lang: locale as LocaleValue,
        },
      ],
    },
  });
  return {
    props: {
      localeAppBar: localeAppBar.data,
      localeLogin: localeLogin.data,
      page: prepagePage(page.data),
    },
  };
}
