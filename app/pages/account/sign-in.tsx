import Head from 'next/head';
import s from '@/styles/Page.module.scss';
import Login from '@/components/Login';
import { GetStaticPropsContext } from 'next';
import { LoginProps } from '@/types';
import AppBar from '@/components/ui/AppBar';
import { getStaticPropsLogin } from '@/utils/getStaticProps';

export default function HomePage({ localeLogin, page, localeAppBar, app: { theme } }: LoginProps) {
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

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<LoginProps, 'app'> }> {
  return getStaticPropsLogin('login')(args);
}
