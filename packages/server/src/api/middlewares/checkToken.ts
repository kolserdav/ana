import { MiddleHandler } from '../../types';
import { parseHeaders } from '../../utils/lib';
import { checkToken } from '../../utils/auth';
import { getErrorResult } from './lib';
import getLocale from '../../utils/getLocale';

const checkTokenMiddleware: MiddleHandler = async (req, res, next) => {
  const { headers, method } = req;
  if (method === 'OPTIONS') {
    return next();
  }
  const { lang, token, id } = parseHeaders(headers);
  const locale = getLocale(lang).server;
  const { error, parsedToken } = await checkToken(token);

  if (error === 2) {
    res.statusCode = 500;
    return res.end(
      getErrorResult({
        message: locale.error,
        code: 500,
      })
    );
  }
  if (error === 1 || !parsedToken) {
    res.statusCode = 403;
    return res.end(
      getErrorResult({
        message: locale.forbidden,
        code: 403,
      })
    );
  }
  if (id !== parsedToken.id) {
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

export default checkTokenMiddleware;
