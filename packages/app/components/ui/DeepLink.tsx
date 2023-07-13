import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ANDROID_APP_NAME } from '../../utils/constants';

function DeepLink() {
  const { pathname } = useRouter();
  const search = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.search;
    }
    return null;
  }, []);

  return <a href={`${ANDROID_APP_NAME}://path${pathname}${search}`}> open in app</a>;
}

export default DeepLink;
