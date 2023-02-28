import { RequestHandler } from '../../../types';
import HandleRequests from '../../../services/handleRequests';
import {
  MessageType,
  SendMessageArgs,
  APPLICATION_JSON,
  ProjectCreateBody,
} from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';

const handleRequests = new HandleRequests({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const projectCreate: RequestHandler<
  { Body: ProjectCreateBody },
  SendMessageArgs<MessageType.SET_PROJECT_CREATE> | SendMessageArgs<MessageType.SET_ERROR>
> = async ({ headers, body }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const res = await handleRequests.sendToQueue<
    SendMessageArgs<MessageType.GET_PROJECT_CREATE>,
    SendMessageArgs<MessageType.SET_PROJECT_CREATE> | SendMessageArgs<MessageType.SET_ERROR>
  >({
    type: MessageType.GET_PROJECT_CREATE,
    id,
    lang,
    timeout: new Date().getTime(),
    data: body,
  });
  reply
    .type(APPLICATION_JSON)
    .code(res.type === MessageType.SET_PROJECT_CREATE ? 201 : res.data.httpCode);
  return res;
};

export default projectCreate;
