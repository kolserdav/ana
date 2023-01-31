import storeLoad, { changeLoad } from '@/store/load';
import { LOAD_PAGE_TIMEOUT } from '@/utils/constants';
import { useEffect, useState } from 'react';

const useLoad = () => {
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, LOAD_PAGE_TIMEOUT);
  }, []);

  /**
   * Stop load after start
   */
  useEffect(() => {
    storeLoad.dispatch(changeLoad({ load }));
  }, [load]);

  return { load, setLoad };
};

export default useLoad;
