import { useEffect, useState } from 'react';
import { PhraseFindManyResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export const usePhrases = () => {
  const [phrases, setPhrases] = useState<PhraseFindManyResult>([]);

  /**
   * Set phrases
   */
  useEffect(() => {
    (async () => {
      const _phrases = await request.phraseFindMany();
      if (_phrases.status !== 'info') {
        log(_phrases.status, _phrases.message, _phrases, true);
        return;
      }
      setPhrases(_phrases.data);
    })();
  }, []);

  return { phrases };
};
