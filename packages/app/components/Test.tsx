import { useEffect, useMemo, useState } from 'react';
import useLoad from '../hooks/useLoad';
import { MessageType } from '../types/interfaces';
import { getLangCookie } from '../utils/cookies';
import { log } from '../utils/lib';
import Request from '../utils/request';
import WS from '../utils/ws';

let send = false;

function Test() {
  const ws = useMemo(() => new WS({ protocol: 'test' }), []);
  const [connId, setConnId] = useState<string>();
  const [count, setCount] = useState<number>(0);
  const { setLoad } = useLoad();
  const req = useMemo(() => new Request(), []);
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

  /**
   * Test request
   */
  useEffect(() => {
    if (!connId || send) {
      return;
    }
    send = true;
    (async () => {
      const res = await req.test(connId);
      if (res?.data?.ok === 'yes') {
        setCount(count + 1);
        setLoad(false);
      } else {
        log('error', 'Error test request', { res });
      }
    })();
  }, [req, connId, count, setLoad]);

  /**
   * Test WS message
   */
  useEffect(() => {
    if (!connId) {
      return;
    }
    setTimeout(() => {
      ws.sendMessage({
        type: MessageType.TEST,
        id: connId,
        lang: getLangCookie(),
        timeout: new Date().getTime(),
        data: { ok: 'yes' },
      });
    }, 100);
  }, [connId, ws]);

  return <div>{count}</div>;
}

export default Test;