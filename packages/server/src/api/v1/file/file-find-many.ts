import { RequestHandler } from '../../../types';
import HandleRequests from '../../../services/handleRequests';
import { MessageType, SendMessageArgs, APPLICATION_JSON } from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';

const handleRequests = new HandleRequests({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFileFindMany: RequestHandler<
  any,
  SendMessageArgs<MessageType.SET_FILE_FIND_MANY>
> = async ({ headers }, reply) => {
  const { lang, id, timeout } = parseHeaders(headers);
  const res = await handleRequests.sendToQueue<
    SendMessageArgs<MessageType.GET_FILE_FIND_MANY>,
    SendMessageArgs<MessageType.SET_FILE_FIND_MANY>
  >({
    type: MessageType.GET_FILE_FIND_MANY,
    id,
    lang,
    timeout: parseInt(timeout, 10),
    data: {
      where: {
        AND: [
          {
            userId: id,
          },
          {
            projectId: null,
          },
        ],
      },
    },
  });
  reply.type(APPLICATION_JSON).code(200);
  return res;
};

export default getFileFindMany;
