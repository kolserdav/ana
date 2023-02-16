import { useEffect, useMemo, useState } from 'react';
import { WSProtocol } from '../types/interfaces';
import { log } from '../utils/lib';
import WS from '../utils/ws';

function useWS({ protocol }: { protocol: WSProtocol }) {
  const [restart, setRestart] = useState<boolean>(false);
  const ws = useMemo(() => {
    log('info', 'Restart WS', { restart });
    return new WS({ protocol });
  }, [protocol, restart]);

  useEffect(() => {
    if (!ws.connection) {
      return;
    }
    ws.connection.onerror = (e) => {
      log('error', 'Error WS', e);
    };
    ws.connection.onclose = (e) => {
      log('warn', 'WS closed', e);
      setRestart(!restart);
    };
  }, [ws, restart]);

  return { ws };
}

export default useWS;
