import Fastify from 'fastify';
import testHandler from './api/v1/get.test';
import { FASTIFY_LOGGER, PORT, V1 } from './utils/constants';

const fastify = Fastify({
  logger: FASTIFY_LOGGER,
});

fastify.get(`/${V1}/test`, testHandler);

fastify.listen({ port: PORT }, (err, address) => {
  if (err) throw err;
  console.log('Server listenning on', address);
});
