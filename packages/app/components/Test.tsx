import { useEffect, useMemo, useState } from 'react';
import useLoad from '../hooks/useLoad';
import { log } from '../utils/lib';
import Request from '../utils/request';

let send = false;

function Test() {
  const [count, setCount] = useState<number>(0);
  const { setLoad } = useLoad();
  const req = useMemo(() => new Request(), []);

  /**
   * Test request
   */
  useEffect(() => {
    if (send) {
      return;
    }
    send = true;
    (async () => {
      const res = await req.test();

      if (res?.ok === 'yes') {
        setCount(count + 1);
        setLoad(false);
      } else {
        log('error', 'Error test request', { res });
      }
    })();
  }, [req, count, setLoad]);

  return <div>{count}</div>;
}

export default Test;
