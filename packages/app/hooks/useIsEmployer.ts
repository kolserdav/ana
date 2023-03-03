import { useRouter } from 'next/router';
import { Pages } from '../utils/constants';

const useIsEmployer = () => {
  const router = useRouter();
  let isEmployer = false;
  if (router.asPath.indexOf(Pages.meEmployer) !== -1) {
    isEmployer = true;
  }
  return isEmployer;
};

export default useIsEmployer;
