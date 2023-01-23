import type { RequestGenericInterface, FastifyRequest, FastifyReply } from 'fastify';

type RequestHandler<T extends RequestGenericInterface, R> = (
  // eslint-disable-next-line no-unused-vars
  req: FastifyRequest<T>,
  // eslint-disable-next-line no-unused-vars
  res: FastifyReply
) => Promise<R>;
