import { RequestHandler } from '../../../types';
import HandleRequests from '../../../services/handleRequests';
import { MessageType, SendMessageArgs, APPLICATION_JSON } from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';

const handleRequests = new HandleRequests({});

interface ProjectCreateBody {
  title: string;
  description: string;
  endDate: string;
  files: string[];
  subcategories: number[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const projectCreate: RequestHandler<
  { Body: ProjectCreateBody },
  SendMessageArgs<MessageType.SET_PROJECT_CREATE> | SendMessageArgs<MessageType.SET_ERROR>
> = async ({ headers }, reply) => {
  const { lang, id } = parseHeaders(headers);
  const res = await handleRequests.sendToQueue<
    SendMessageArgs<MessageType.GET_PROJECT_CREATE>,
    SendMessageArgs<MessageType.SET_PROJECT_CREATE>
  >({
    type: MessageType.GET_PROJECT_CREATE,
    id,
    lang,
    timeout: new Date().getTime(),
    data: {
      data: {},
    },
  });
  reply.type(APPLICATION_JSON).code(200);
  return res;
};

export default projectCreate;
