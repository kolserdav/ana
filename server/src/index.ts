import Fastify from 'fastify';
import cors from '@fastify/cors';
import cluster from 'cluster';
import getTestHandler from './api/v1/get.test';
import { CORS, FASTIFY_LOGGER, PORT, V1 } from './utils/constants';
import HandleRequests from './services/handleRequests';
import { log } from './utils/lib';

if (cluster.isPrimary) {
  process.on('uncaughtException', (err: Error) => {
    log('error', '[MASTER] uncaughtException', err);
  });
  process.on('unhandledRejection', (err: Error) => {
    log('error', '[MASTER] unhandledRejection', err);
  });

  const worker = cluster.fork();
  const handleRequests = new HandleRequests('request', worker);
  handleRequests.listenWorker();
} else {
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
}
