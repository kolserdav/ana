import { LocaleValue, Status } from '../../types/interfaces';

export const getErrorResult = ({ message, code }: { message: string; code: number }) =>
  JSON.stringify({
    status: 'error',
    code,
    message,
    data: null,
  });
