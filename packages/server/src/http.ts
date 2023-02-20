import Fastify from 'fastify';
import cors from 'cors';
import { APP_URL, CLOUD_PATH, FASTIFY_LOGGER, HOST, PORT } from './utils/constants';
import { createDir, log } from './utils/lib';
import getTestHandler from './api/v1/get-test';
import { Api } from './types/interfaces';
import getLocaleHandler from './api/v1/get-locale';
import pageFindManyHandler from './api/v1/page/find-many';
import getUserFindFirst from './api/v1/user/user-find-first';
import checkTokenMiddleware from './api/middlewares/checkToken';
import fileUpload from './api/v1/file/file-upload';
import getFileFindMany from './api/v1/file/file-find-many';

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

  await fastify.register(import('@fastify/middie'));
  await fastify.use(cors({ origin: [APP_URL] }));
  await fastify.use(
    [Api.getUserFindFirst, Api.postFileUpload, Api.getFileFindMany],
    checkTokenMiddleware
  );
  await fastify.register(import('@fastify/multipart'));

  fastify.get(Api.testV1, getTestHandler);
  fastify.get(Api.getLocaleV1, getLocaleHandler);
  fastify.post(Api.postPageFindManyV1, pageFindManyHandler);
  fastify.get(Api.getUserFindFirst, getUserFindFirst);
  fastify.post(Api.postFileUpload, fileUpload);
  fastify.get(Api.getFileFindMany, getFileFindMany);

  fastify.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) throw err;
    console.log('Server listenning on', address);
    createDir(CLOUD_PATH);
  });
})();
