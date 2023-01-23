import { RequestHandler } from '../../types';
import { APPLICATION_JSON } from '../../utils/constants';
import HandleRequests from '../../services/handleRequests';

const handleRequests = new HandleRequests('request');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTestHandler: RequestHandler<any, any> = async ({ query }, reply) => {
  handleRequests.sendToQueue(query);
  reply.type(APPLICATION_JSON).code(200);
  return query;
};

export default getTestHandler;
