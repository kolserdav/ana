import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { Pages } from '../utils/constants';

export default function useCloseAuth({
  user,
  userLoad,
}: {
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'];
  userLoad: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!user && userLoad) {
      router.push(`${Pages.signIn}?r=${router.asPath}`);
    }
  }, [user, router, userLoad]);
}
