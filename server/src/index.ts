import Fastify from 'fastify';
import cluster from 'cluster';
import getTestHandler from './api/v1/get.test';
import { FASTIFY_LOGGER, PORT, V1 } from './utils/constants';
import HandleRequests from './services/handleRequests';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  const handleRequests = new HandleRequests('request', worker);
  handleRequests.listenWorker();
} else {
  const fastify = Fastify({
    logger: FASTIFY_LOGGER,
  });

  fastify.get(`/${V1}/test`, getTestHandler);

  fastify.listen({ port: PORT }, (err, address) => {
    if (err) throw err;
    console.log('Server listenning on', address);
  });
}
