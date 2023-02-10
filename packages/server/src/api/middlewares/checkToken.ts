import { MiddleHandler } from '../../types';
import { getLocale, parseHeaders } from '../../utils/lib';
import { checkToken } from '../../utils/auth';
import { getErrorResult } from './lib';

const checkTokenMiddleware: MiddleHandler = async (req, res, next) => {
  const { headers, method } = req;
  if (method === 'OPTIONS') {
    return next();
  }
  const { lang, id, token, timeout } = parseHeaders(headers);
  const locale = getLocale(lang).server;
  const result = await checkToken(token);
  if (result === 2) {
    res.statusCode = 500;
    return res.end(
      getErrorResult({
        message: locale.error,
        code: 500,
        status: 'error',
        lang,
        timeout,
        id,
      })
    );
  }
  if (result === 1) {
    res.statusCode = 403;
    return res.end(
      getErrorResult({
        message: locale.forbidden,
        code: 403,
        status: 'warn',
        lang,
        timeout,
        id,
      })
    );
  }
  return next();
};

export default checkTokenMiddleware;
