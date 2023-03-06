import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppBar from '../../../../components/AppBar';
import { AppProps } from '../../../../types';
import { Locale, MessageType, SendMessageArgs } from '../../../../types/interfaces';
import Request from '../../../../utils/request';
import s from '../../../../styles/Page.module.scss';
import { log } from '../../../../utils/lib';
import Project from '../../../../components/Project';
import useCloseAuth from '../../../../hooks/useCloseAuth';
import useIsEmployer from '../../../../hooks/useIsEmployer';
import useCloseRole from '../../../../hooks/useCloseRole';

const request = new Request();

interface ProjectPageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
}

export default function ProjectPage({
  app: { user, theme, userLoad },
  localeAppBar,
}: ProjectPageProps) {
  useCloseAuth({ user, userLoad });

  const isEmployer = useIsEmployer();

  useCloseRole({ user, isEmployer });
  const { query } = useRouter();

  const [project, setProject] =
    useState<SendMessageArgs<MessageType.SET_PROJECT_FIND_FIRST>['data']>();

  const id = typeof query.id === 'string' ? query.id : '';

  /**
   * Set project
   */
  useEffect(() => {
    (async () => {
      const _project = await request.projectFindFirst({ id });
      if (_project.type === MessageType.SET_ERROR) {
        log(_project.data.status, _project.data.message, { _project }, true);
        return;
      }
      setProject(_project.data);
    })();
  }, [id]);

  return (
    <>
      <Head>
        <title>{project?.title}</title>
      </Head>
      <AppBar user={user} theme={theme} full locale={localeAppBar} />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        {project && <Project project={project} />}
      </main>
    </>
  );
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext): Promise<{ props: Omit<ProjectPageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  return {
    props: {
      localeAppBar: localeAppBar.data,
    },
  };
}
