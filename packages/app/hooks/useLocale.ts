import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Locale } from '../types/interfaces';
import Request from '../utils/request';

const request = new Request();

const useLocale = () => {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale['app']['app']>();
  /**
   * Get locale
   */
  useEffect(() => {
    (async () => {
      const _locale = await request.getLocale({ field: 'app', locale: router.locale });
      setLocale(_locale.data);
    })();
  }, [router.locale]);

  return { locale };
};

export default useLocale;
