import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { ANDROID_APP_NAME, DEEP_LINK_HOST } from '../../utils/constants';
import s from './DeepLink.module.scss';
import { isAndroid } from '../../utils/lib';

function DeepLink({ children }: { children: string }) {
  const router = useRouter();
  const { pathname } = router;
  const search = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.search;
    }
    return null;
  }, []);

  const link = `${ANDROID_APP_NAME}://${DEEP_LINK_HOST}${pathname}${search}`;

  /**
   * Check link
   */
  const clickDeepLink = () => {
    try {
      fetch(link)
        .then((r) => {
          console.log(0, r.status);
        })
        .catch((e) => {
          console.error(1, e);
        });
    } catch (e) {
      alert(1);
    }
  };

  return (
    <div className={s.wrapper}>
      {isAndroid() && typeof androidCommon === 'undefined' && (
        <button type="button" onClick={clickDeepLink}>
          {children}
        </button>
      )}
    </div>
  );
}

export default DeepLink;
