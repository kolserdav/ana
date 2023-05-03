import { useRouter } from 'next/router';
import { useMemo } from 'react';

const useIsCanonical = () => {
  const router = useRouter();

  const isCanonical = useMemo(() => {
    const { locale } = router;
    return locale === 'en' || locale === 'ru';
  }, [router]);

  return { isCanonical };
};

export default useIsCanonical;
