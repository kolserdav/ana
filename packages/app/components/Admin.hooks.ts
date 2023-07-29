import { Lang, PushNotification } from '@prisma/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Request from '../utils/request';
import {
  PUSH_NOTIFICATIONS_TAKE,
  PUSH_NOTIFICATION_DESCRIPTION_MAX_LENGTH,
  PUSH_NOTIFICATION_LANG_DEFAULT,
  PUSH_NOTIFICATION_PATH_DEFAULT,
  Pages,
  TEXTAREA_ROWS_DEFAULT,
} from '../utils/constants';
import { getFormatDistance, log, shortenString } from '../utils/lib';
import {
  Locale,
  LocaleValue,
  PushNotificationFindManyResult,
  UserCleanResult,
} from '../types/interfaces';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export const usePushNotifications = ({
  setLoad,
}: {
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [pushs, setPushs] = useState<PushNotification[]>([]);
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);
  const [restart, setRestart] = useState(false);

  /**
   * Get push notifications
   */
  useEffect(() => {
    (async () => {
      log('info', 'Get push notifications', { restart });
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
  }, [setLoad, skip, restart]);

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

  const pushRestart = useCallback(() => {
    setSkip(0);
    setRestart(!restart);
  }, [setSkip, setRestart, restart]);

  const _pushs = useMemo(
    () =>
      pushs.map((item) => {
        const _item = { ...item };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _item.updated = getFormatDistance(item.updated, router.locale as LocaleValue) as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _item.created = getFormatDistance(item.created, router.locale as LocaleValue) as any;
        return _item;
      }),
    [pushs, router.locale]
  );

  return {
    pushs: _pushs,
    pages,
    page,
    onClickPushPaginationWrapper,
    pushRestart,
  };
};

export const useCreatePushNotification = ({
  user,
  setLoad,
  locale,
  pushRestart,
}: {
  user: UserCleanResult | null;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  locale: Locale['app']['admin'];
  pushRestart: () => void;
}) => {
  const [pushDialog, setPushDialog] = useState<boolean>(false);
  const [pushSubject, setPushSubject] = useState<string>('');
  const [pushSubjectError, setPushSubjectError] = useState<string>('');
  const [pushTextError, setPushTextError] = useState<string>('');
  const [pushText, setPushText] = useState<string>('');
  const [pushTextRows, setPushTextRows] = useState<number>(TEXTAREA_ROWS_DEFAULT);
  const [pushPath, setPushPath] = useState<string>(PUSH_NOTIFICATION_PATH_DEFAULT);
  const [pushLang, setPushLang] = useState<Lang>(PUSH_NOTIFICATION_LANG_DEFAULT);
  const [deletePushNotificationDialog, setDeletePushNotificationDialog] = useState(false);
  const [pushPriority, setPushPriority] = useState<string | null>(null);
  const [pushNotificationToDelete, setPushNotificationToDelete] = useState<
    PushNotificationFindManyResult[0] | null
  >(null);
  const [pushNotificationToUpdate, setPushNotificationToUpdate] = useState<
    PushNotificationFindManyResult[0] | null
  >(null);

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
    setPushLang(PUSH_NOTIFICATION_LANG_DEFAULT);
    setPushPath(PUSH_NOTIFICATION_PATH_DEFAULT);
    setPushPriority(null);
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
    pushRestart();
  };

  const onClickChangePush = async () => {
    if (!pushNotificationToUpdate || !pushPriority) {
      log(
        'warn',
        'Push notification to update or push priority is',
        { pushNotificationToUpdate, pushPriority },
        true
      );
      return;
    }
    setLoad(true);
    const notification = await request.pushNotificationUpdate({
      id: pushNotificationToUpdate.id,
      title: pushSubject,
      description: pushText,
      path: pushPath,
      lang: pushLang,
      priority: parseInt(pushPriority, 10),
    });
    setLoad(false);
    log(notification.status, notification.message, notification, true);
    if (notification.status !== 'info') {
      return;
    }
    cleanFields();
    setPushDialog(false);
    setPushNotificationToUpdate(null);
    pushRestart();
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
    // TODO
  };

  const onChangePushPath = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;
    setPushPath(value);
  };

  const onChangePushLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;
    setPushLang(value as Lang);
  };

  const pagePaths = useMemo(
    () => Object.keys(Pages).filter((item) => !/account/.test(Pages[item as keyof typeof Pages])),
    []
  );

  const onClickPushNotificationDeleteWraper = (push: PushNotificationFindManyResult[0]) => () => {
    setPushNotificationToDelete(push);
    setDeletePushNotificationDialog(true);
  };

  const onChangePushPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setPushPriority(value);
  };

  const onClickPushNotificationUpdateWraper = (push: PushNotificationFindManyResult[0]) => () => {
    setPushNotificationToUpdate(push);
    setPushDialog(true);
    setPushText(push.description);
    setPushSubject(push.title);
    setPushTextRows(TEXTAREA_ROWS_DEFAULT);
    setPushPath(push.path);
    setPushLang(push.lang);
    setPushPriority(push.priority.toString());
  };

  const deletePushNotification = async () => {
    if (!pushNotificationToDelete) {
      log('warn', 'Push notification is', pushNotificationToDelete, true);
      return;
    }
    setLoad(true);
    const notification = await request.pushNotificationDelete({ id: pushNotificationToDelete.id });
    setLoad(false);
    log(notification.status, notification.message, notification, true);
    if (notification.status !== 'info') {
      return;
    }
    cleanFields();
    setDeletePushNotificationDialog(false);
    setPushNotificationToDelete(null);
    pushRestart();
  };

  const onClickCloseDeletePushNotification = () => {
    setDeletePushNotificationDialog(false);
    setPushNotificationToDelete(null);
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
    onChangePushLang,
    onChangePushPath,
    pushLang,
    pushPath,
    pagePaths,
    onClickPushNotificationUpdateWraper,
    onClickPushNotificationDeleteWraper,
    deletePushNotification,
    deletePushNotificationDialog,
    setDeletePushNotificationDialog,
    onClickCloseDeletePushNotification,
    pushNotificationToDelete,
    pushPriority,
    onChangePushPriority,
    onClickChangePush,
  };
};
