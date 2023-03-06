import { RequestHandler } from '../../../types';
import HandleRequests from '../../../services/handleRequests';
import {
  MessageType,
  SendMessageArgs,
  APPLICATION_JSON,
  ProjectGiveBody,
} from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';

const handleRequests = new HandleRequests({});

const projectGive: RequestHandler<
  { Body: ProjectGiveBody },
  SendMessageArgs<MessageType.SET_GIVE_PROJECT> | SendMessageArgs<MessageType.SET_ERROR>
> = async ({ headers, body }, reply) => {
  const { lang, id, timeout } = parseHeaders(headers);
  const res = await handleRequests.sendToQueue<
    SendMessageArgs<MessageType.GET_GIVE_PROJECT>,
    SendMessageArgs<MessageType.SET_GIVE_PROJECT> | SendMessageArgs<MessageType.SET_ERROR>
  >({
    type: MessageType.GET_GIVE_PROJECT,
    id,
    lang,
    timeout: parseInt(timeout, 10),
    data: body,
  });
  reply.type(APPLICATION_JSON).code(201);
  return res;
};

export default projectGive;
