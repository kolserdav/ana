import { useEffect, useState } from 'react';
import storeLoad, { changeLoad } from '../store/load';
import { LOAD_PAGE_DURATION } from '../utils/constants';

const useLoad = () => {
  const [load, setLoad] = useState<boolean>(true);

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
