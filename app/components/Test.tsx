import { MessageType } from '@/types/interfaces';
import { log } from '@/utils/lib';
import Request from '@/utils/request';
import WS from '@/utils/ws';
import { useEffect, useMemo, useState } from 'react';

const Test = () => {
  const ws = useMemo(() => new WS({ protocol: 'home' }), []);
  const [id, setId] = useState<string>();
  const [count, setCount] = useState<number>(0);

  const req = useMemo(() => new Request(), []);

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      await req.test(id);
    })();
  }, [req, id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    ws.sendMessage({
      type: MessageType.TEST,
      id,
      data: { ok: 'yes' },
    });
  }, [id, ws]);

  /**
   * Connect to WS
   */
  useEffect(() => {
    if (!ws.connection) {
      return;
    }
    ws.connection.onmessage = (msg) => {
      const { data } = msg;
      const rawMessage = ws.parseMessage(data);
      if (!rawMessage) {
        return;
      }
      const { type, id } = rawMessage;
      switch (type) {
        case MessageType.SET_CONNECTION_ID:
          setId(id);
          break;
        case MessageType.TEST:
          setCount(count + 1);
          break;
        default:
          log('warn', 'Not implemented on ws message case', rawMessage);
      }
    };
  }, [ws, count]);

  return <>{count}</>;
};

export default Test;
