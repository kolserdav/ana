import { useEffect, useState } from 'react';
import storeLoad, { changeLoad } from '../store/load';
import { LOAD_PAGE_DURATION } from '../utils/constants';
import Request from '../utils/request';
import { log } from '../utils/lib';

const request = new Request();

const useLoad = () => {
  const [load, setLoad] = useState<boolean>(true);

  /**
   * Check internet
   */
  useEffect(() => {
    (async () => {
      const cheRes = await request.checkNewUrl(window.location.origin);
      if (cheRes?.status !== 'info') {
        log('error', 'No internet', cheRes, true, true);
      }
    })();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, LOAD_PAGE_DURATION);
  }, []);

  /**
   * Stop load after start
   */
  useEffect(() => {
    storeLoad.dispatch(changeLoad({ load }));
  }, [load]);

  /**
   * Listen store load
   */
  useEffect(() => {
    const cleanSubs = storeLoad.subscribe(() => {
      const { load: _load } = storeLoad.getState();
      if (_load !== load) {
        setLoad(_load);
      }
    });
    return () => {
      cleanSubs();
    };
  }, [load]);

  return { load, setLoad };
};

export default useLoad;
