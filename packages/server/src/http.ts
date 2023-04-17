import Fastify from 'fastify';
import cors from 'cors';
import serveStatic from 'serve-static';
import proxy from '@fastify/http-proxy';
import { APP_URL, CLOUD_PATH, FASTIFY_LOGGER, HOST, PORT, TRANSLATE_URL } from './utils/constants';
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
import checkRestoreKey from './api/v1/user/check-restore-key';
import restorePassword from './api/v1/user/restore-password';
import confirmEmail from './api/v1/user/confirm-email';
import userFindFirst from './api/v1/user/find-first';
import phraseCreate from './api/v1/phrase/create';
import tagCreate from './api/v1/tag/create';
import tagFindMany from './api/v1/tag/findMany';

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
  fastify.register(proxy, {
    upstream: TRANSLATE_URL,
    prefix: '/libre',
    http2: false,
  });
  await fastify.register(import('@fastify/middie'), { hook: 'preHandler' });
  await fastify.use(cors({ origin: [APP_URL] }));
  await fastify.use(
    [Api.getUserFindFirst, Api.postPhraseCreate, Api.postTagCreate, Api.getTagsFindMany],
    checkTokenMiddleware
  );

  // Open routes
  fastify.use([CLOUD_PREFIX], serveStatic(CLOUD_PATH));
  fastify.post(Api.postPageFindManyV1, pageFindManyHandler);
  fastify.post(Api.postUserLogin, userLogin);
  fastify.post(Api.postUserCreateV1, userCreate);
  fastify.post(Api.postForgotPassword, forgotPassword);
  fastify.post(Api.postRestorePassword, restorePassword);
  fastify.get(Api.testV1, getTestHandler);
  fastify.get(Api.postPageFindManyV1, pageFindManyHandler);
  fastify.get(Api.getCheckRestoreKey, checkRestoreKey);
  fastify.get(Api.getCheckEmail, checkEmailHandler);
  fastify.get(Api.getLocaleV1, getLocaleHandler);
  fastify.put(Api.putConfirmEmail, confirmEmail);

  // Auth routes
  fastify.get(Api.getUserFindFirst, userFindFirst);
  fastify.post(Api.postPhraseCreate, phraseCreate);
  fastify.post(Api.postTagCreate, tagCreate);
  fastify.get(Api.getTagsFindMany, tagFindMany);

  fastify.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) throw err;
    log('info', 'Server listenning on', address, true);
    createDir(CLOUD_PATH);
  });
})();
