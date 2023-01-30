import { RequestHandler } from '../../../types';
import { APPLICATION_JSON } from '../../../utils/constants';
import HandleRequests from '../../../services/handleRequests';
import { MessageType } from '../../../types/interfaces';
import { parseHeaders } from '../../../utils/lib';
import { Prisma } from '@prisma/client';

const handleRequests = new HandleRequests({ protocol: 'request', caller: 'user-create' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTestHandler: RequestHandler<{ Body: Prisma.UserCreateArgs['data'] }, any> = async (
  { query, headers, body },
  reply
) => {
  const { id, lang } = parseHeaders(headers);

  handleRequests.sendToQueue(
    {
      type: MessageType.GET_USER_CREATE,
      id,
      lang,
      data: body,
    },
    { headers }
  );
  reply.type(APPLICATION_JSON).code(200);
  return query;
};

export default getTestHandler;
