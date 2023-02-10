import { useEffect, useState } from 'react';
import useLoad from '../hooks/useLoad';
import useQueryString from '../hooks/useQueryString';
import useWS from '../hooks/useWS';
import { Theme } from '../Theme';
import { Locale, MessageType, SendMessageArgs } from '../types/interfaces';
import { LOAD_PAGE_DURATION } from '../utils/constants';
import { getLangCookie } from '../utils/cookies';
import { awaitResponse } from '../utils/lib';
import s from './ConfirmEmail.module.scss';
import Typography from './ui/Typography';

function ConfirmEmail({ theme, locale }: { theme: Theme; locale: Locale['app']['confirmEmail'] }) {
  const [error, setError] = useState<string>('');
  const [connId, setConnId] = useState<string>();
  const [result, setResult] = useState<string>();
  const { load, setLoad } = useLoad();
  const { e, k } = useQueryString<{ e: string; k: string }>();
  const { ws } = useWS({ protocol: 'confirm-email' });

  /**
   * Set params
   */
  useEffect(() => {
    let interval = setTimeout(() => {
      /** */
    }, 0);
    if (!e || !k) {
      interval = setTimeout(() => {
        setError(locale.paramsNotFound);
      }, LOAD_PAGE_DURATION);
    } else {
      setError('');
    }
    return () => {
      clearInterval(interval);
    };
  }, [e, k, locale]);

  /**
   * Listen messages
   */
  useEffect(() => {
    if (!ws.connection) {
      return;
    }

    const setConfirmEmail = async ({
      data: { message },
      timeout,
    }: SendMessageArgs<MessageType.SET_CONFIRM_EMAIL>) => {
      await awaitResponse(timeout);
      setLoad(false);
      setResult(message);
    };

    const setErrorHandler = ({
      data: { message },
    }: SendMessageArgs<MessageType.SET_CONFIRM_EMAIL>) => {
      setError(message);
    };

    ws.connection.onmessage = (msg) => {
      const rawMessage = ws.parseMessage(msg.data);
      if (!rawMessage) {
        return;
      }
      const { type, id } = rawMessage;
      switch (type) {
        case MessageType.SET_CONNECTION_ID:
          setConnId(id);
          break;
        case MessageType.SET_CONFIRM_EMAIL:
          setConfirmEmail(rawMessage);
          break;
        case MessageType.SET_ERROR:
          setErrorHandler(rawMessage);
          break;
        default:
      }
    };
  }, [ws, setLoad]);

  /**
   * Check key
   */
  useEffect(() => {
    if (!connId || !e || !k) {
      return;
    }
    setLoad(true);
    ws.sendMessage({
      timeout: new Date().getTime(),
      id: connId,
      type: MessageType.GET_CONFIRM_EMAIL,
      lang: getLangCookie(),
      data: {
        email: e,
        key: k,
      },
    });
  }, [connId, e, k, ws, setLoad]);

  return (
    <div className={s.wrapper} style={{ backgroundColor: theme.paper }}>
      <div className={s.container}>
        <Typography align="center" theme={theme} variant="h1">
          {locale.title}
        </Typography>
        <Typography styleName="error" align="center" theme={theme} variant="h4">
          {error}
        </Typography>
        <Typography variant="h4" align="center" styleName="info" theme={theme}>
          {result || ''}
        </Typography>
      </div>
    </div>
  );
}

export default ConfirmEmail;
