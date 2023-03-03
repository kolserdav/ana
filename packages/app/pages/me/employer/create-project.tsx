import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import AppBar from '../../../components/AppBar';
import CreateProject from '../../../components/CreateProject';
import useCloseAuth from '../../../hooks/useCloseAuth';
import { CreateProjectPageProps } from '../../../types';
import s from '../../../styles/Page.module.scss';
import useIsEmployer from '../../../hooks/useIsEmployer';
import useCloseRole from '../../../hooks/useCloseRole';
import { getStaticPropsCreateProject } from '../../../utils/getStaticProps';

export default function CreateProjectPage({
  app: { user, theme, userLoad, touchpad },
  localeAppBar,
  localeCreateProject,
  localeCommon,
  page,
}: CreateProjectPageProps) {
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
        <CreateProject
          user={user}
          eliminateRemarks={localeCommon.eliminateRemarks}
          fieldMustBeNotEmpty={localeCommon.fieldMustBeNotEmpty}
          maxFileSize={localeCommon.maxFileSize}
          somethingWentWrong={localeCommon.somethingWentWrong}
          showHelp={localeCommon.showHelp}
          touchpad={touchpad}
          locale={localeCreateProject}
          formDesc={localeCommon.formDesc}
          theme={theme}
        />
      </main>
    </>
  );
}

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<CreateProjectPageProps, 'app'> }> {
  return getStaticPropsCreateProject('meEmployerCreateProject')(args);
}
