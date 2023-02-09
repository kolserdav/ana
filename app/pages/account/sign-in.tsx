import Head from 'next/head';
import s from '@/styles/Page.module.scss';
import Login from '@/components/Login';
import { GetStaticPropsContext } from 'next';
import { LoginProps } from '@/types';
import AppBar from '@/components/AppBar';
import { getStaticPropsLogin } from '@/utils/getStaticProps';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Pages } from '@/utils/constants';

export default function HomePage({
  localeLogin,
  page,
  localeAppBar,
  app: { theme, user },
}: LoginProps) {
  const router = useRouter();

  /**
   * Check is logged
   */
  useEffect(() => {
    if (user) {
      const { role } = user;
      switch (role) {
        case 'employer':
          router.push(Pages.meEployer);
          break;
        case 'worker':
          router.push(Pages.meWorker);
          break;
        default:
          router.push(Pages.home);
      }
    }
  }, [user, router]);

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar theme={theme} withoutExpandLess locale={localeAppBar} user={user} />
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
