import { useEffect, useState } from 'react';
import { ServerLanguage } from '../types';
import Request from '../utils/request';

const request = new Request();

const useLangs = () => {
  const [langs, setLangs] = useState<ServerLanguage[]>([]);

  /**
   * Set langs
   */
  useEffect(() => {
    (async () => {
      const _langs = await request.getLanguages();
      if (typeof _langs.map === 'function') {
        setLangs(_langs);
      }
    })();
  }, []);

  return { langs };
};

export default useLangs;
