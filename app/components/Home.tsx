import { MessageType } from '@/types/interfaces';
import { log } from '@/utils/lib';
import Request from '@/utils/request';
import WS from '@/utils/ws';
import { useEffect, useMemo, useState } from 'react';

const Home = () => {
  const ws = useMemo(() => new WS({ protocol: 'home' }), []);
  const [id, setId] = useState<string>();

  const req = useMemo(() => new Request(), []);

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      const res = await req.test(id);
    })();
  }, [req, id]);

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
          ws.sendMessage({
            type: MessageType.TEST,
            id,
            data: { ok: 'no' },
          });
          break;
        default:
          log('warn', 'Not implemented on ws message case', rawMessage.data);
      }
    };
  }, [ws]);

  return <>Home</>;
};

export default Home;
