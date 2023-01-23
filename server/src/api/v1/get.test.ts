import { RequestHandler } from '../../../types';
import { APPLICATION_JSON } from '../../utils/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testHandler: RequestHandler<any, any> = async ({ body }, reply) => {
  reply.type(APPLICATION_JSON).code(200);
  return body;
};

export default testHandler;
