import Fastify from 'fastify';
import { FASTIFY_LOGGER, PORT } from './utils/constants';

const fastify = Fastify({
  logger: FASTIFY_LOGGER,
});

fastify.get<{
  Querystring: { m: number };
  Body: { t: string };
  Reply: { t: string };
}>('/', async ({ body, query: { m } }, reply) => {
  reply.type('application/json').code(200);
  return body;
});

fastify.listen({ port: PORT }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
