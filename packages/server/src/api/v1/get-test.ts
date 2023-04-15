import { RequestHandler } from '../../types';
import { APPLICATION_JSON } from '../../types/interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTestHandler: RequestHandler<any, any> = async ({ headers, body, query }, reply) => {
  reply.type(APPLICATION_JSON).code(200);
  return { body, query, headers };
};

export default getTestHandler;
