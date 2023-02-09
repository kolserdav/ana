import { MessageType, SendMessageArgs } from '@/types/interfaces';
import Request from '@/utils/request';
import { useEffect, useState } from 'react';

const request = new Request();

export default function useUser() {
  const [user, setUser] = useState<SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data']>(null);

  /**
   * Get user
   */
  useEffect(() => {
    (async () => {
      const _user = await request.getUser();
      console.log(_user);
      setUser(_user.data);
    })();
  }, []);

  return { user };
}
