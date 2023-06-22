import { MiddleHandler } from '../../types';
import { parseHeaders } from '../../utils/lib';
import { checkToken } from '../../utils/auth';
import { getErrorResult } from './lib';
import getLocale from '../../utils/getLocale';

const checkTokenMiddleware: MiddleHandler = async (req, res, next) => {
  const { headers, method, origin } = req;
  if (method === 'OPTIONS') {
    return next();
  }
  const { lang, token } = parseHeaders(headers);
  const locale = getLocale(lang).server;
  const result = 1;
  console.log(origin);
  if (result === 1) {
    res.statusCode = 403;
    return res.end(
      getErrorResult({
        message: locale.forbidden,
        code: 403,
      })
    );
  }
  return next();
};

export default checkTokenMiddleware;
