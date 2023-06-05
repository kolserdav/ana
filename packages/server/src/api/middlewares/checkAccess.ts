import { Prisma, PrismaClient } from '@prisma/client';
import { MiddleHandler } from '../../types';
import { log, parseHeaders } from '../../utils/lib';
import { getErrorResult } from './lib';
import getLocale from '../../utils/getLocale';
import { QUERY_STRING_ARRAY_SPLITTER } from '../../types/interfaces';

const checkAccessMiddlewareWrapper: <
  P extends keyof typeof Prisma,
  T extends keyof typeof Prisma.ModelName,
  V extends keyof (typeof Prisma)[P]
>(
  // eslint-disable-next-line no-unused-vars
  prisma: PrismaClient,
  // eslint-disable-next-line no-unused-vars
  options: {
    /**
     * Name of body property in target model which to becompare with fieldId value
     */
    bodyField?: V;
    /**
     * Name of query string property in target model which to be compare with fieldId value
     */
    queryField?: V;
    key: P;
    model: T;
    /**
     * Name of property from body or query which will be compare with id of model record
     */
    fieldId: string;
    many?: boolean;
  }
) => MiddleHandler =
  (prisma, { bodyField, queryField, model, fieldId, many }) =>
  async (req, res, next) => {
    const { headers, method, body, query } = req;
    const { lang, id } = parseHeaders(headers);

    const locale = getLocale(lang).server;
    if (!many) {
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
    } else {
      const targetId =
        bodyField && body ? body[fieldId] : query[fieldId].split(QUERY_STRING_ARRAY_SPLITTER);
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
      let result = [];
      try {
        // @ts-ignore
        result = await prisma[model].findMany({
          where: {
            id: {
              in: targetId,
            },
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
      for (let i = 0; result[i]; i++) {
        if (result[i][field] !== id) {
          res.statusCode = 401;
          return res.end(
            getErrorResult({
              message: locale.unauthorized,
              code: 401,
            })
          );
        }
      }
    }
    return next();
  };

export default checkAccessMiddlewareWrapper;
