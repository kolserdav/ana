import { RequestHandler } from '../../../types';
import HandleRequests from '../../../services/handleRequests';
import {
  MessageType,
  SendMessageArgs,
  APPLICATION_JSON,
  ProjectPostMessageBody,
} from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';

const handleRequests = new HandleRequests({});

const postProjectMessage: RequestHandler<
  { Body: ProjectPostMessageBody },
  SendMessageArgs<MessageType.SET_POST_PROJECT_MESSAGE> | SendMessageArgs<MessageType.SET_ERROR>
> = async ({ headers, body }, reply) => {
  const { lang, id, timeout } = parseHeaders(headers);
  const res = await handleRequests.sendToQueue<
    SendMessageArgs<MessageType.GET_POST_PROJECT_MESSAGE>,
    SendMessageArgs<MessageType.SET_POST_PROJECT_MESSAGE> | SendMessageArgs<MessageType.SET_ERROR>
  >({
    type: MessageType.GET_POST_PROJECT_MESSAGE,
    id,
    lang,
    timeout: parseInt(timeout, 10),
    data: body,
  });
  reply.type(APPLICATION_JSON).code(201);
  return res;
};

export default postProjectMessage;
