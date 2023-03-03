import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { MessageType, SendMessageArgs } from '../types/interfaces';

const useCloseRole = ({
  user,
  isEmployer,
}: {
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'];
  isEmployer: boolean;
}) => {
  const router = useRouter();
  /**
   * Check user role
   */
  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.role === 'employer' && !isEmployer) {
      router.push(router.asPath.replace(/\/worker\//, '/employer/'));
    } else if (user.role === 'worker' && isEmployer) {
      router.push(router.asPath.replace(/\/employer\//, '/worker/'));
    }
  }, [router, user, isEmployer]);
};

export default useCloseRole;
