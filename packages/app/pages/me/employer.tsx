import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import AppBar from '../../components/AppBar';
import useCloseAuth from '../../hooks/useCloseAuth';
import { MePageProps } from '../../types';
import s from '../../styles/Page.module.scss';
import Me from '../../components/Me';
import { getStaticPropsMe } from '../../utils/getStaticProps';
import useIsEmployer from '../../hooks/useIsEmployer';
import useCloseRole from '../../hooks/useCloseRole';

export default function MeEmployerPage({
  app: { user, theme, userLoad },
  localeAppBar,
  page,
  localeMe,
}: MePageProps) {
  useCloseAuth({ user, userLoad });

  const isEmployer = useIsEmployer();

  useCloseRole({ user, isEmployer });

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar user={user} theme={theme} locale={localeAppBar} full />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Me
          isEmployer={isEmployer}
          locale={localeMe}
          theme={theme}
          user={user}
          userLoad={userLoad}
        />
      </main>
    </>
  );
}

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<MePageProps, 'app'> }> {
  return getStaticPropsMe('meEmployer')(args);
}
