import { MessageType } from '@/types/interfaces';
import { getLangCookie } from '@/utils/cookies';
import { log } from '@/utils/lib';
import Request from '@/utils/request';
import WS from '@/utils/ws';
import { useEffect, useMemo, useState } from 'react';

function Test() {
  const ws = useMemo(() => new WS({ protocol: 'home' }), []);
  const [connId, setConnId] = useState<string>();
  const [count, setCount] = useState<number>(0);

  const req = useMemo(() => new Request(), []);

  useEffect(() => {
    if (!connId) {
      return;
    }
    (async () => {
      await req.test(connId);
    })();
  }, [req, connId]);

  useEffect(() => {
    if (!connId) {
      return;
    }
    ws.sendMessage({
      type: MessageType.TEST,
      id: connId,
      lang: getLangCookie(),
      data: { ok: 'yes' },
    });
  }, [connId, ws]);

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
          setConnId(id);
          break;
        case MessageType.TEST:
          setCount(count + 1);
          break;
        default:
          log('warn', 'Not implemented on ws message case', rawMessage);
      }
    };
  }, [ws, count]);

  return <div>{count}</div>;
}

export default Test;
