import Fastify from 'fastify';
import cors from '@fastify/cors';
import { CORS, FASTIFY_LOGGER, PORT, V1 } from './utils/constants';
import { log } from './utils/lib';
import getTestHandler from './api/v1/get.test';

process.on('uncaughtException', (err: Error) => {
  log('error', '[WORKER] uncaughtException', err);
});
process.on('unhandledRejection', (err: Error) => {
  log('error', '[WORKER] unhandledRejection', err);
});

(async () => {
  const fastify = Fastify({
    logger: FASTIFY_LOGGER,
  });

  await fastify.register(cors, {
    origin: CORS ? CORS.split(',') : undefined,
  });

  fastify.get(`/${V1}/test`, getTestHandler);

  fastify.listen({ port: PORT }, (err, address) => {
    if (err) throw err;
    console.log('Server listenning on', address);
  });
})();
