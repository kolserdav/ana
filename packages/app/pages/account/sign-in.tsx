import Head from 'next/head';
import { GetStaticPropsContext } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import s from '../../styles/Page.module.scss';
import Login from '../../components/Login';
import { LoginProps } from '../../types';
import AppBar from '../../components/AppBar';
import { getStaticPropsLogin } from '../../utils/getStaticProps';
import { Pages } from '../../utils/constants';
import LoaderFull from '../../components/ui/LoaderFull';

export default function HomePage({
  localeLogin,
  page,
  localeAppBar,
  localeCommon,
  app: { theme, user, userLoad },
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
          router.push(Pages.meEmployer);
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
        <Login formDesc={localeCommon.formDesc} theme={theme} locale={localeLogin} />
      </main>
      <LoaderFull open={!userLoad} noOpacity />
    </>
  );
}

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<LoginProps, 'app'> }> {
  return getStaticPropsLogin('login')(args);
}