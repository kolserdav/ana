import { RequestHandler } from '../../../types';
import {
  MessageType,
  SendMessageArgs,
  APPLICATION_JSON,
  FileDeleteBody,
} from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';
import HandleRequests from '../../../services/handleRequests';

const handleRequests = new HandleRequests({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileDelete: RequestHandler<
  {
    Body: FileDeleteBody;
  },
  SendMessageArgs<MessageType.SET_FILE_DELETE | MessageType.SET_ERROR>
> = async (req, reply) => {
  const { headers, body } = req;
  const { fileId } = body;
  const { lang, id, timeout } = parseHeaders(headers);

  const deleteR = await handleRequests.sendToQueue<
    SendMessageArgs<MessageType.GET_FILE_DELETE>,
    SendMessageArgs<MessageType.SET_FILE_DELETE> | SendMessageArgs<MessageType.SET_ERROR>
  >({
    id,
    type: MessageType.GET_FILE_DELETE,
    lang,
    timeout: parseInt(timeout, 10),
    data: {
      where: {
        id: fileId,
      },
    },
  });

  if (deleteR.type === MessageType.SET_ERROR) {
    reply.type(APPLICATION_JSON).code(500);
    return {
      type: MessageType.SET_ERROR,
      id,
      lang,
      timeout: parseInt(timeout, 10),
      data: {
        type: MessageType.GET_FILE_UPLOAD,
        message: deleteR.data.message,
        httpCode: deleteR.data.httpCode,
        status: deleteR.data.status,
      },
    };
  }

  reply.type(APPLICATION_JSON).code(201);
  return {
    type: MessageType.SET_FILE_DELETE,
    id,
    lang,
    timeout: parseInt(timeout, 10),
    data: null,
  };
};

export default fileDelete;
