import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { UserRole } from '@prisma/client';
import { Pages } from '../utils/constants';
import { UserCleanResult } from '../types/interfaces';

export default function useCloseRole({
  user,
  userLoad,
  whiteList,
}: {
  user: UserCleanResult | null;
  userLoad: boolean;
  whiteList: UserRole[];
}) {
  const router = useRouter();

  /**
   * Check user role
   */
  useEffect(() => {
    if (!userLoad) {
      return;
    }
    if (!user) {
      router.push(`${Pages.signIn}?r=${router.asPath}`);
      return;
    }
    if (whiteList.indexOf(user.role) === -1) {
      router.push(Pages.translate);
    }
  }, [user, router, userLoad, whiteList]);
}
