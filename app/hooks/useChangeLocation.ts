import { useRouter } from 'next/router';
import { useEffect } from 'react';

let oldPath = '';

// eslint-disable-next-line no-unused-vars
function useChangeLocation(cb: (asPath: string) => void) {
  const router = useRouter();
  useEffect(() => {
    if (oldPath !== router.asPath) {
      cb(router.asPath);
      oldPath = router.asPath;
    }
  }, [router.asPath, cb]);
}

export default useChangeLocation;
