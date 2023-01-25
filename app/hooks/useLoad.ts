import { useState } from 'react';

const useLoad = () => {
  const [load, setLoad] = useState<boolean>(false);

  return { load, setLoad };
};

export default useLoad;
