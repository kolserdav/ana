import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ANDROID_APP_NAME, DEEP_LINK_HOST } from '../../utils/constants';
import s from './DeepLink.module.scss';
import { isAndroid } from '../../utils/lib';
import { Theme } from '../../Theme';

function DeepLink({ children, theme }: { children: string; theme: Theme }) {
  const { pathname } = useRouter();
  const search = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.search;
    }
    return null;
  }, []);

  const link = `${ANDROID_APP_NAME}://${DEEP_LINK_HOST}${pathname}${search}`;

  return (
    <div className={s.wrapper} style={{ color: theme.blue }}>
      {isAndroid() && typeof androidCommon === 'undefined' && <a href={link}>{children}</a>}
    </div>
  );
}

export default DeepLink;
