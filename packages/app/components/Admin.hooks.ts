import { Lang, PushNotification } from '@prisma/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Request from '../utils/request';
import {
  PUSH_NOTIFICATIONS_TAKE,
  PUSH_NOTIFICATION_DESCRIPTION_MAX_LENGTH,
  PUSH_NOTIFICATION_DESCRIPTION_MIN_LENGTH,
  PUSH_NOTIFICATION_LANG_DEFAULT,
  TEXTAREA_ROWS_DEFAULT,
} from '../utils/constants';
import { log, shortenString } from '../utils/lib';
import { Locale, UserCleanResult } from '../types/interfaces';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export const usePushNotifications = ({
  setLoad,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [pushs, setPushs] = useState<PushNotification[]>([]);
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);

  /**
   * Get push notifications
   */
  useEffect(() => {
    (async () => {
      setLoad(true);
      const _pushs = await request.pushNotificationFindMany({
        skip: skip.toString(),
        take: PUSH_NOTIFICATIONS_TAKE.toString(),
      });
      setLoad(false);
      if (_pushs.status !== 'info') {
        log(_pushs.status, _pushs.message, _pushs, true);
        return;
      }
      setPushs(_pushs.data);
      setCount(_pushs.count || 0);
    })();
  }, [setLoad, skip]);

  const onClickPushPaginationWrapper = useCallback(
    (pageNum: number) => () => {
      setSkip((pageNum - 1) * PUSH_NOTIFICATIONS_TAKE);
    },
    []
  );

  const pages = useMemo(
    () =>
      new Array(Math.ceil(count / PUSH_NOTIFICATIONS_TAKE)).fill(0).map((_, index) => index + 1),
    [count]
  );
  const page = useMemo(
    () => Math.floor((skip + PUSH_NOTIFICATIONS_TAKE) / PUSH_NOTIFICATIONS_TAKE),
    [skip]
  );

  return { pushs, pages, page, onClickPushPaginationWrapper };
};

export const useCreatePushNotification = ({
  user,
  setLoad,
  locale,
}: {
  user: UserCleanResult | null;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  locale: Locale['app']['admin'];
}) => {
  const [pushDialog, setPushDialog] = useState<boolean>(false);
  const [pushSubject, setPushSubject] = useState<string>('');
  const [pushSubjectError, setPushSubjectError] = useState<string>('');
  const [pushTextError, setPushTextError] = useState<string>('');
  const [pushText, setPushText] = useState<string>('');
  const [pushTextRows, setPushTextRows] = useState<number>(TEXTAREA_ROWS_DEFAULT);
  const [pushPath, setPushPath] = useState<string>('');
  const [pushLang, setPushLang] = useState<Lang>(PUSH_NOTIFICATION_LANG_DEFAULT);

  const changePushText = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = e as any;

    let _value = value;
    if (value.length > PUSH_NOTIFICATION_DESCRIPTION_MAX_LENGTH) {
      _value = shortenString(value, PUSH_NOTIFICATION_DESCRIPTION_MAX_LENGTH);
    }
    if (_value.length >= PUSH_NOTIFICATION_DESCRIPTION_MAX_LENGTH && pushTextError) {
      setPushTextError('');
    }
    setPushText(_value);
  };

  const onChangePushSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value && pushSubjectError) {
      setPushSubjectError('');
    }
    setPushSubject(value);
  };

  const checkFileds = () => {
    let error = 0;
    if (!pushSubject) {
      error = 1;
      setPushSubjectError(locale.titleMustBeNotEmpty);
    }
    return error;
  };

  const cleanFields = () => {
    setPushText('');
    setPushTextError('');
    setPushSubject('');
    setPushSubjectError('');
    setPushTextRows(TEXTAREA_ROWS_DEFAULT);
  };

  const onClickPush = async () => {
    if (!user || checkFileds()) {
      return;
    }
    setLoad(true);
    const res = await request.pushNotificationCreate({
      title: pushSubject,
      description: pushText,
      path: pushPath,
      lang: pushLang,
    });
    setLoad(false);
    log(res.status, res.message, res, true);
    if (res.status !== 'info') {
      return;
    }
    cleanFields();
    setPushDialog(false);
  };

  const onClickCancelPush = () => {
    cleanFields();
    setPushDialog(false);
  };

  const onClickOpenPushDialog = () => {
    setPushDialog(true);
  };

  const onKeyDownOpenPushDialog = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
      onClickOpenPushDialog();
    }
  };

  const onBlurPushSubject = () => {
    //
  };

  return {
    onClickPush,
    onKeyDownOpenPushDialog,
    pushDialog,
    setPushDialog,
    onClickCancelPush,
    onClickOpenPushDialog,
    onChangePushSubject,
    onBlurPushSubject,
    pushSubject,
    pushSubjectError,
    changePushText,
    pushText,
    pushTextRows,
    pushTextError,
  };
};
