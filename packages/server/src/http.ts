import Fastify from 'fastify';
import cors from 'cors';
import serveStatic from 'serve-static';

import { APP_URL, CLOUD_PATH, FASTIFY_LOGGER, HOST, PORT } from './utils/constants';
import { createDir, log } from './utils/lib';
import getTestHandler from './api/v1/get-test';
import { Api, CLOUD_PREFIX } from './types/interfaces';
import getLocaleHandler from './api/v1/get-locale';
import checkTokenMiddleware from './api/middlewares/checkToken';

import pageFindManyHandler from './api/v1/page/find-many';
import userLogin from './api/v1/user/login';
import checkEmailHandler from './api/v1/user/check-email';
import userCreate from './api/v1/user/create';
import forgotPassword from './api/v1/user/forgot-password';

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

  await fastify.register(import('@fastify/middie'), { hook: 'preHandler' });
  await fastify.use(cors({ origin: [APP_URL] }));
  await fastify.use([Api.getUserFindFirst], checkTokenMiddleware);

  fastify.use([CLOUD_PREFIX], serveStatic(CLOUD_PATH));
  fastify.post(Api.postPageFindManyV1, pageFindManyHandler);
  fastify.post(Api.postUserLogin, userLogin);
  fastify.post(Api.postUserCreateV1, userCreate);
  fastify.post(Api.postForgotPassword, forgotPassword);
  fastify.get(Api.testV1, getTestHandler);
  fastify.get(Api.getCheckEmail, checkEmailHandler);
  fastify.get(Api.getLocaleV1, getLocaleHandler);

  fastify.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) throw err;
    log('info', 'Server listenning on', address, true);
    createDir(CLOUD_PATH);
  });
})();
