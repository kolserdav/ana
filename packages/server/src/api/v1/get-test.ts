import { RequestHandler } from '../../types';
import HandleRequests from '../../services/handleRequests';
import { MessageType, SendMessageArgs, APPLICATION_JSON } from '../../types/interfaces';
import { parseHeaders } from '../../utils/lib';

const handleRequests = new HandleRequests({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTestHandler: RequestHandler<any, SendMessageArgs<MessageType.TEST>> = async (
  { headers },
  reply
) => {
  const { lang, id, timeout } = parseHeaders(headers);
  const res = await handleRequests.sendToQueue<
    SendMessageArgs<MessageType.TEST>,
    SendMessageArgs<MessageType.TEST>
  >({
    type: MessageType.TEST,
    id,
    lang,
    timeout: parseInt(timeout, 10),
    data: {
      ok: 'yes',
    },
  });
  reply.type(APPLICATION_JSON).code(200);
  return res;
};

export default getTestHandler;
