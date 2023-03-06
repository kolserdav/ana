import Fastify from 'fastify';
import cors from 'cors';
import serveStatic from 'serve-static';
import { PrismaClient } from '@prisma/client';
import { APP_URL, CLOUD_PATH, FASTIFY_LOGGER, HOST, PORT } from './utils/constants';
import { createDir, log } from './utils/lib';
import getTestHandler from './api/v1/get-test';
import { Api, CLOUD_PREFIX, FileDeleteBody, getMaxBodySize } from './types/interfaces';
import getLocaleHandler from './api/v1/get-locale';
import pageFindManyHandler from './api/v1/page/find-many';
import getUserFindFirst from './api/v1/user/user-find-first';
import checkTokenMiddleware from './api/middlewares/checkToken';
import fileUpload from './api/v1/file/file-upload';
import getFileFindMany from './api/v1/file/file-find-many';
import fileDelete from './api/v1/file/file-delete';
import checkAccessMiddlewareWrapper from './api/middlewares/checkAccess';
import categoryFindMany from './api/v1/category/category-find-many';
import projectCreate from './api/v1/project/project-create';
import projectFindMany from './api/v1/project/project-find-many';
import projectFindFirst from './api/v1/project/project-find-first';

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
  });

  await fastify.register(import('@fastify/middie'), { hook: 'preHandler' });
  await fastify.use(cors({ origin: [APP_URL] }));
  await fastify.use(
    [
      Api.getUserFindFirst,
      Api.postFileUpload,
      Api.getFileFindMany,
      Api.deleteFileDelete,
      Api.projectCreate,
      Api.projectFindMany,
    ],
    checkTokenMiddleware
  );
  await fastify.use(
    [Api.deleteFileDelete],
    checkAccessMiddlewareWrapper(prisma, {
      model: 'File',
      bodyField: 'userId',
      key: 'FileScalarFieldEnum',
      fieldId: 'fileId' as keyof FileDeleteBody,
    })
  );
  await fastify.register(import('@fastify/multipart'), {
    limits: {
      fileSize: getMaxBodySize(),
    },
  });
  fastify.use([CLOUD_PREFIX], serveStatic(CLOUD_PATH));

  fastify.get(Api.testV1, getTestHandler);
  fastify.get(Api.getLocaleV1, getLocaleHandler);
  fastify.post(Api.postPageFindManyV1, pageFindManyHandler);
  fastify.get(Api.getUserFindFirst, getUserFindFirst);
  fastify.post(Api.postFileUpload, fileUpload);
  fastify.get(Api.getFileFindMany, getFileFindMany);
  fastify.delete(Api.deleteFileDelete, fileDelete);
  // Project
  fastify.post(Api.projectCreate, projectCreate);
  fastify.get(Api.projectFindMany, projectFindMany);
  fastify.get(Api.projectFindFirst, projectFindFirst);
  // Open
  fastify.get(Api.categoryFindMany, categoryFindMany);

  fastify.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) throw err;
    log('info', 'Server listenning on', address, true);
    createDir(CLOUD_PATH);
  });
})();
