import { GetStaticPropsContext } from 'next';
import { MePageProps } from '../../types';
import { getStaticPropsMe } from '../../utils/getStaticProps';
import MeEmployerPage from './employer';

export default MeEmployerPage;

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<MePageProps, 'app'> }> {
  return getStaticPropsMe('meWorker')(args);
}
