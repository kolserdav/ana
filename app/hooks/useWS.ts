import { WSProtocol } from '@/types/interfaces';
import WS from '@/utils/ws';
import { useMemo } from 'react';

function useWS({ protocol }: { protocol: WSProtocol }) {
  const ws = useMemo(() => new WS({ protocol }), [protocol]);

  return { ws };
}

export default useWS;
