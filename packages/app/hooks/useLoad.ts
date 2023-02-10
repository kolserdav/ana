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

  return { load, setLoad };
};

export default useLoad;
