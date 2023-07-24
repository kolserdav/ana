import { useCallback, useEffect, useState } from 'react';
import storeUserRenew from '../store/userRenew';
import { log } from '../utils/lib';
import Request from '../utils/request';
import { UserCleanResult } from '../types/interfaces';

const request = new Request();
const { userRenew: userRenewDef } = storeUserRenew.getState();

const NEED_UPDATE_MESSAGE = 'Need to update the application';

export default function useUser() {
  const [userLoad, setUserLoad] = useState<boolean>(false);
  const [user, setUser] = useState<UserCleanResult | null>(null);
  const [renew, setRenew] = useState<boolean>(userRenewDef);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(false);

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
   * Android set notification id
   */
  useEffect(() => {
    if (typeof androidCommon === 'undefined' || !user) {
      return;
    }
    if (typeof androidCommon.getUUID === 'undefined') {
      log('warn', NEED_UPDATE_MESSAGE, {});
      return;
    }
    const notificationId = androidCommon.getUUID();
    (async () => {
      const updateRes = await request.userUpdate({ notificationId, userId: user.id });
      log(updateRes.status, updateRes.message, updateRes);
    })();
  }, [user]);

  /**
   * Set time zone
   */
  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      const updateRes = await request.userUpdate({
        timeZone: new Date().getTimezoneOffset() / 60,
        userId: user.id,
      });
      log(updateRes.status, updateRes.message, updateRes);
    })();
  }, [user]);

  /**
   * Set notification enabled
   */
  useEffect(() => {
    if (!user) {
      return;
    }
    setNotificationEnabled(user.pushEnabled);
  }, [user]);

  const changeNotificationEnabled = useCallback(
    (pushEnabled: boolean) => {
      if (!user) {
        return;
      }
      (async () => {
        const updateRes = await request.userUpdate({
          userId: user.id,
          pushEnabled,
        });
        log(updateRes.status, updateRes.message, updateRes);
      })();
      if (typeof androidCommon === 'undefined') {
        return;
      }
      if (typeof androidCommon.setNotificationEnabled === 'undefined') {
        log('warn', NEED_UPDATE_MESSAGE, {});
        return;
      }
      androidCommon.setNotificationEnabled(pushEnabled);
    },
    [user]
  );

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

  return { user, userLoad, notificationEnabled, setNotificationEnabled: changeNotificationEnabled };
}
