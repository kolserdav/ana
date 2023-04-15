import { useEffect, useState } from 'react';
import storeUserRenew from '../store/userRenew';
import { log } from '../utils/lib';
import Request from '../utils/request';
import { UserCleanResult } from '../types/interfaces';

const request = new Request();
const { userRenew: userRenewDef } = storeUserRenew.getState();

export default function useUser() {
  const [userLoad, setUserLoad] = useState<boolean>(false);
  const [user, setUser] = useState<UserCleanResult | null>(null);
  const [renew, setRenew] = useState<boolean>(userRenewDef);

  /**
   * Get user
   */
  useEffect(() => {
    (async () => {
      const _user = await request.getUser();
      setUserLoad(true);
      if (_user.status !== 'info') {
        log(_user.status, _user.message, { _user });
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
