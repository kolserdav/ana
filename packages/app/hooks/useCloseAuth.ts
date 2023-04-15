import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Pages } from '../utils/constants';
import { UserCleanResult } from '../types/interfaces';

export default function useCloseAuth({
  user,
  userLoad,
}: {
  user: UserCleanResult;
  userLoad: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!user && userLoad) {
      router.push(`${Pages.signIn}?r=${router.asPath}`);
    }
  }, [user, router, userLoad]);
}
