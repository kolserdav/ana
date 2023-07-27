import { UserRole } from '@prisma/client';
import { MiddleHandler } from '../../types';
import { parseHeaders } from '../../utils/lib';
import { getErrorResult } from './lib';
import getLocale from '../../utils/getLocale';
import { ORM } from '../../services/orm';

const orm = new ORM();

// eslint-disable-next-line no-unused-vars
const checkRoleMiddlewareWrapper: (whiteList: UserRole[]) => MiddleHandler =
  (whiteList) => async (req, res, next) => {
    const { headers, method } = req;
    if (method === 'OPTIONS') {
      return next();
    }
    const { lang, id } = parseHeaders(headers);
    const locale = getLocale(lang).server;

    const user = await orm.userFindFirst({ where: { id } });

    if (!user || !user.data) {
      res.statusCode = 403;
      return res.end(
        getErrorResult({
          message: locale.forbidden,
          code: 403,
        })
      );
    }
    if (whiteList.findIndex((item) => item === user.data?.role) === -1) {
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

export default checkRoleMiddlewareWrapper;
