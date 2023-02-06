import { RequestHandler } from '../../../types';
import { APPLICATION_JSON } from '../../../utils/constants';
import HandleRequests from '../../../services/handleRequests';
import { MessageType } from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';

const handleRequests = new HandleRequests({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userFindFirst: RequestHandler<{ Querystring: { id: string } }, any> = async (
  { query, headers },
  reply
) => {
  const { lang, id, token } = parseHeaders(headers);
  handleRequests.sendToQueue(
    {
      type: MessageType.TEST,
      id,
      lang,
      timeout: new Date().getTime(),
      data: {
        ok: 'yes',
      },
    },
    { headers }
  );
  reply.type(APPLICATION_JSON).code(200);
  return query;
};

export default userFindFirst;
