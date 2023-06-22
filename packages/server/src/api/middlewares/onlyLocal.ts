import { MiddleHandler } from '../../types';
import { parseHeaders } from '../../utils/lib';
import { getErrorResult } from './lib';
import getLocale from '../../utils/getLocale';

const onlyLocals: MiddleHandler = async (req, res, next) => {
  const { headers, method, hostname } = req;
  if (method === 'OPTIONS') {
    return next();
  }
  const { lang } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  if (!/^localhost/.test(hostname) && !/^127\.0\.0\.1/.test(hostname)) {
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

export default onlyLocals;
