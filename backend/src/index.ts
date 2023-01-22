import Fastify from 'fastify';
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

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
