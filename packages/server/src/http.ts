import Fastify from 'fastify';
import cors from 'cors';
import serveStatic from 'serve-static';
import proxy from '@fastify/http-proxy';
import { APP_URL, CLOUD_PATH, FASTIFY_LOGGER, HOST, PORT, TRANSLATE_URL } from './utils/constants';
import { createDir, log } from './utils/lib';
import getTestHandler from './api/v1/get-test';
import { Api, CLOUD_PREFIX, TRANSLATE_PREFIX } from './types/interfaces';
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
import phraseFindMany from './api/v1/phrase/findMany';
import phraseDelete from './api/v1/phrase/delete';
import checkAccessMiddlewareWrapper from './api/middlewares/checkAccess';
import { PrismaClient } from '@prisma/client';
import phraseUpdate from './api/v1/phrase/update';
import phraseFindFirst from './api/v1/phrase/findFirst';
import tagDelete from './api/v1/tag/delete';
import tagUpdate from './api/v1/tag/update';
import checkCSRFMiddlewareWrapper from './api/middlewares/checkCSRF';

const prisma = new PrismaClient();

process.on('uncaughtException', (err: Error) => {
  log('error', '[WORKER] uncaughtException', err);
});
process.on('unhandledRejection', (err: Error) => {
  log('error', '[WORKER] unhandledRejection', err);
});

(async () => {
  const fastify = Fastify({
    logger: FASTIFY_LOGGER,
    ajv: {
      customOptions: {
        coerceTypes: 'array',
      },
    },
  });

  fastify.register(proxy, {
    upstream: TRANSLATE_URL,
    prefix: TRANSLATE_PREFIX,
    http2: false,
  });

  await fastify.register(import('@fastify/middie'), { hook: 'preHandler' });
  await fastify.use(cors({ origin: [APP_URL] }));
  await fastify.use(
    [
      Api.getUserFindFirst,
      Api.postPhraseCreate,
      Api.postTagCreate,
      Api.getTagsFindMany,
      Api.getPhraseFindMany,
      Api.deletePhrase,
      Api.putPhrase,
      Api.getPhrase,
      Api.deleteTag,
      Api.putTag,
    ],
    checkTokenMiddleware
  );

  await fastify.use([Api.translate], checkCSRFMiddlewareWrapper(prisma));

  await fastify.use(
    [Api.deletePhrase, Api.putPhrase, Api.getPhrase],
    checkAccessMiddlewareWrapper(prisma, {
      model: 'Phrase',
      bodyField: 'userId',
      key: 'PhraseScalarFieldEnum',
      fieldId: 'phraseId',
    })
  );

  await fastify.use(
    [Api.deleteTag, Api.putTag],
    checkAccessMiddlewareWrapper(prisma, {
      model: 'Phrase',
      bodyField: 'userId',
      key: 'TagScalarFieldEnum',
      fieldId: 'tagId',
    })
  );

  await fastify.use(
    [Api.getPhrase],
    checkAccessMiddlewareWrapper(prisma, {
      model: 'Phrase',
      queryField: 'userId',
      key: 'PhraseScalarFieldEnum',
      fieldId: 'phraseId',
    })
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
  fastify.get(Api.getPhraseFindMany, phraseFindMany);
  fastify.delete(Api.deletePhrase, phraseDelete);
  fastify.put(Api.putPhrase, phraseUpdate);
  fastify.get(Api.getPhrase, phraseFindFirst);
  fastify.delete(Api.deleteTag, tagDelete);
  fastify.put(Api.putTag, tagUpdate);

  fastify.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) throw err;
    log('info', 'Server listenning on', address, true);
    createDir(CLOUD_PATH);
  });
})();
