import { MiddleHandler } from '../../types';
import { parseHeaders } from '../../utils/lib';
import getLocale from '../../utils/getLocale';
import { getErrorResult } from './lib';
import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line no-unused-vars
const checkCSRFMiddlewareWrapper: (prisma: PrismaClient) => MiddleHandler =
  (prisma) => async (req, res, next) => {
    const { headers, method } = req;
    if (method === 'OPTIONS') {
      return next();
    }
    const { lang, csrf } = parseHeaders(headers);
    const locale = getLocale(lang).server;

    const result = await prisma.online.findFirst({
      where: {
        id: csrf,
      },
    });

    if (result === null) {
      res.statusCode = 400;
      return res.end(
        getErrorResult({
          message: locale.badRequest,
          code: 400,
        })
      );
    }
    return next();
  };

export default checkCSRFMiddlewareWrapper;
