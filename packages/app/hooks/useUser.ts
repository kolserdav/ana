import { useEffect, useState } from 'react';
import storeUserRenew from '../store/userRenew';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import Request from '../utils/request';

const request = new Request();
const { userRenew: userRenewDef } = storeUserRenew.getState();

export default function useUser() {
  const [userLoad, setUserLoad] = useState<boolean>(false);
  const [user, setUser] = useState<SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data']>(null);
  const [renew, setRenew] = useState<boolean>(userRenewDef);

  /**
   * Get user
   */
  useEffect(() => {
    (async () => {
      const _user = await request.getUser();
      setUserLoad(true);
      if (_user.type === MessageType.SET_ERROR) {
        setUser(null);
        return;
      }
      setUser(_user.data);
    })();
  }, [renew]);

  /**
   * Listen need renew
   */
  useEffect(() => {
    const cleanSubs = storeUserRenew.subscribe(() => {
      const { userRenew } = storeUserRenew.getState();
      setRenew(userRenew);
    });
    return () => {
      cleanSubs();
    };
  }, []);

  return { user, userLoad };
}
