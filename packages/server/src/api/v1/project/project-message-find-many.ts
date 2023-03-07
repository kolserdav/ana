import { RequestHandler } from '../../../types';
import HandleRequests from '../../../services/handleRequests';
import {
  MessageType,
  SendMessageArgs,
  APPLICATION_JSON,
  ProjectMessageFindManyQuery,
} from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';

const handleRequests = new HandleRequests({});

const projectMessageFindMany: RequestHandler<
  { Querystring: ProjectMessageFindManyQuery },
  | SendMessageArgs<MessageType.SET_PROJECT_MESSAGE_FIND_MANY>
  | SendMessageArgs<MessageType.SET_ERROR>
> = async ({ headers, query }, reply) => {
  const { lang, id, timeout } = parseHeaders(headers);
  const res = await handleRequests.sendToQueue<
    SendMessageArgs<MessageType.GET_PROJECT_MESSAGE_FIND_MANY>,
    | SendMessageArgs<MessageType.SET_PROJECT_MESSAGE_FIND_MANY>
    | SendMessageArgs<MessageType.SET_ERROR>
  >({
    type: MessageType.GET_PROJECT_MESSAGE_FIND_MANY,
    id,
    lang,
    timeout: parseInt(timeout, 10),
    data: query,
  });
  reply.type(APPLICATION_JSON).code(200);
  return res;
};

export default projectMessageFindMany;
