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
  locale: Locale['app']['login'];
  page: PageFull;
}

export default function HomePage({ locale, page }: LoginProps) {
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar theme={theme} withoutExpandLess />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Login theme={theme} locale={locale} />
        <Login theme={theme} locale={locale} />
        <Login theme={theme} locale={locale} />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: LoginProps }> {
  const localeLogin = await request.getLocale({ field: 'login', locale });
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
      locale: localeLogin.data,
      page: prepagePage(page.data),
    },
  };
}
