import { GetStaticPropsContext } from 'next';
import s from '../../styles/Page.module.scss';
import Login from '../../components/Login';
import { LoginProps } from '../../types';
import AppBar from '../../components/AppBar';
import { getStaticPropsLogin } from '../../utils/getStaticProps';
import LoaderFull from '../../components/ui/LoaderFull';
import Head from '../../components/Head';

export default function HomePage({
  localeLogin,
  page,
  localeAppBar,
  localeCommon,
  app: { theme, user, userLoad },
}: LoginProps) {
  return (
    <>
      <Head title={page.title} description={page.description} keywords={page.keywords} noIndex />
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
          openInApp={localeCommon.openInApp}
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
