import Head from 'next/head';
import { GetStaticPropsContext } from 'next';
import s from '../../styles/Page.module.scss';
import Login from '../../components/Login';
import { LoginProps } from '../../types';
import AppBar from '../../components/AppBar';
import { getStaticPropsLogin } from '../../utils/getStaticProps';
import LoaderFull from '../../components/ui/LoaderFull';

export default function HomePage({
  localeLogin,
  page,
  localeAppBar,
  localeCommon,
  app: { theme, user, userLoad },
}: LoginProps) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar theme={theme} withoutExpandLess locale={localeAppBar} user={user} />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <Login
          eliminateRemarks={localeCommon.eliminateRemarks}
          fieldMustBeNotEmpty={localeCommon.fieldMustBeNotEmpty}
          formDesc={localeCommon.formDesc}
          theme={theme}
          locale={localeLogin}
          user={user}
          policyTitle={localeCommon.policyTitle}
          rulesTitle={localeCommon.rulesTitle}
          and={localeCommon.and}
          sendMail={localeCommon.sendMail}
          emailIsSend={localeCommon.emailIsSend}
        />
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
