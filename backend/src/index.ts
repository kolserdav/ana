import Fastify from 'fastify';
import { PORT } from './utils/constants';

console.log(PORT);

const fastify = Fastify({
  logger: true,
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
