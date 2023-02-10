import { useMemo } from 'react';
import { WSProtocol } from '../types/interfaces';
import WS from '../utils/ws';

function useWS({ protocol }: { protocol: WSProtocol }) {
  const ws = useMemo(() => new WS({ protocol }), [protocol]);

  return { ws };
}

export default useWS;
