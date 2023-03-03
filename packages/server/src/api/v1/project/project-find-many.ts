import { RequestHandler } from '../../../types';
import HandleRequests from '../../../services/handleRequests';
import { MessageType, SendMessageArgs, APPLICATION_JSON } from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';

const handleRequests = new HandleRequests({});

const projectFindMany: RequestHandler<
  any,
  SendMessageArgs<MessageType.SET_PROJECT_FIND_MANY> | SendMessageArgs<MessageType.SET_ERROR>
> = async ({ headers }, reply) => {
  const { lang, id, timeout } = parseHeaders(headers);
  const res = await handleRequests.sendToQueue<
    SendMessageArgs<MessageType.GET_PROJECT_FIND_MANY>,
    SendMessageArgs<MessageType.SET_PROJECT_FIND_MANY> | SendMessageArgs<MessageType.SET_ERROR>
  >({
    type: MessageType.GET_PROJECT_FIND_MANY,
    id,
    lang,
    timeout: parseInt(timeout, 10),
    data: null,
  });
  reply.type(APPLICATION_JSON).code(200);
  return res;
};

export default projectFindMany;
