import { GetStaticPropsContext } from 'next';
import { CreateProjectPageProps } from '../../../types';
import { getStaticPropsCreateProject } from '../../../utils/getStaticProps';
import CreateProjectPage from '../employer/create-project';

export default CreateProjectPage;

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<CreateProjectPageProps, 'app'> }> {
  return getStaticPropsCreateProject('meWorkerCreateProject')(args);
}
