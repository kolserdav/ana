import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ANDROID_APP_NAME, DEEP_LINK_HOST } from '../../utils/constants';
import s from './DeepLink.module.scss';
import { isAndroid } from '../../utils/lib';

function DeepLink({ children }: { children: string }) {
  const { pathname } = useRouter();
  const search = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.search;
    }
    return null;
  }, []);

  return (
    <div className={s.wrapper}>
      {isAndroid() && typeof androidCommon === 'undefined' && (
        <a href={`${ANDROID_APP_NAME}://${DEEP_LINK_HOST}${pathname}${search}`}>{children}</a>
      )}
    </div>
  );
}

export default DeepLink;
