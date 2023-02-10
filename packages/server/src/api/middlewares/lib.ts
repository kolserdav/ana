import { LocaleValue, MessageType, Status } from '../../types/interfaces';

export const getErrorResult = ({
  timeout,
  message,
  lang,
  id,
  status,
  code,
}: {
  timeout: string;
  message: string;
  lang: LocaleValue;
  id: string;
  status: Status;
  code: number;
}) =>
  JSON.stringify({
    type: MessageType.SET_ERROR,
    timeout: new Date(parseInt(timeout, 10)).getTime(),
    id,
    lang,
    data: {
      type: MessageType.AUTH,
      status,
      message,
      httpCode: code,
    },
  });
