import { Prisma, PrismaClient } from '@prisma/client';
import { MiddleHandler } from '../../types';
import { getLocale, log, parseHeaders } from '../../utils/lib';
import { getErrorResult } from './lib';

const checkAccessMiddlewareWrapper: <
  P extends keyof typeof Prisma,
  T extends keyof typeof Prisma.ModelName,
  V extends keyof (typeof Prisma)[P]
>(
  // eslint-disable-next-line no-unused-vars
  prisma: PrismaClient,
  // eslint-disable-next-line no-unused-vars
  options: {
    bodyField?: V;
    queryField?: V;
    key: P;
    model: T;
    fieldId: string;
  }
) => MiddleHandler =
  (prisma, { bodyField, queryField, model, fieldId }) =>
  async (req, res, next) => {
    const { headers, method, body, query } = req;
    const { lang, id } = parseHeaders(headers);

    const locale = getLocale(lang).server;
    const targetId = bodyField && body ? body[fieldId] : query[fieldId];
    if (!targetId) {
      log('error', 'Target id not specified in middleware', { url: req.url });
      res.statusCode = 501;
      return res.end(
        getErrorResult({
          message: locale.notImplement,
          code: 501,
        })
      );
    }

    if (method === 'OPTIONS') {
      return next();
    }

    const field = queryField || bodyField || '';
    let result;
    try {
      // @ts-ignore
      result = await prisma[model].findFirst({
        where: {
          id: targetId,
        },
        select: {
          [field]: true,
        },
      });
    } catch (err) {
      log('error', 'Error middleware', err);
      res.statusCode = 500;
      return res.end(
        getErrorResult({
          message: locale.error,
          code: 500,
        })
      );
    }
    if (result && result[field] !== id) {
      res.statusCode = 401;
      return res.end(
        getErrorResult({
          message: locale.unauthorized,
          code: 401,
        })
      );
    }
    return next();
  };

export default checkAccessMiddlewareWrapper;
