import { PushNotification } from '@prisma/client';
import { useEffect, useState } from 'react';
import Request from '../utils/request';
import { PUSH_NOTIFICATIONS_TAKE } from '../utils/constants';
import { log } from '../utils/lib';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export const usePushNotifications = ({
  setLoad,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [pushs, setPushs] = useState<PushNotification[]>([]);
  const [skip, setSkip] = useState(0);

  /**
   * Get push notifications
   */
  useEffect(() => {
    (async () => {
      setLoad(true);
      const _pushs = await request.pushNotificationFindMany({
        skip: skip.toString(),
        take: PUSH_NOTIFICATIONS_TAKE.toString(),
      });
      setLoad(false);
      if (_pushs.status !== 'info') {
        log(_pushs.status, _pushs.message, _pushs, true);
        return;
      }
      setPushs(_pushs.data);
    })();
  }, [setLoad, skip]);

  return { pushs };
};
