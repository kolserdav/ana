import { GetStaticPropsContext } from 'next';
import { LoginProps } from '../../types';
import { getStaticPropsLogin } from '../../utils/getStaticProps';
import Login from './sign-in';

export default Login;

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<LoginProps, 'app'> }> {
  return getStaticPropsLogin('changePassword')(args);
}
