import { ubuntu400 } from '@/fonts/ubuntu';
import storeAlert from '@/store/alert';
import { Theme } from '@/Theme';
import { ALERT_COUNT_MAX, ALERT_TIMEOUT, ALERT_TRANSITION } from '@/utils/constants';
import { getDangerouslyCurrent, waitForTimeout } from '@/utils/lib';
import clsx from 'clsx';
import React, { createRef, useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import CloseCircleIcon from '../icons/CloseCircle';
import ErrorIcon from '../icons/Error';
import InfoIcon from '../icons/Info';
import WarnIcon from '../icons/Warn';
import s from './Alert.module.scss';
import IconButton from './IconButton';

const getButtonId = (button: HTMLButtonElement | null) => {
  const id = button?.getAttribute('id');
  if (!id) {
    return null;
  }
  return id;
};

const itemClassNameRegexp = /_i__\d+/;

const getItemClassName = (index: number) => s[`i__${index}`];

function Alert({ theme }: { theme: Theme }) {
  const [alerts, setAlerts] = useState<Record<string, React.ReactElement>>({});
  const [toDelete, setToDelete] = useState<string[]>([]);
  const [deletedId, setDeletedI] = useState<string>('0');

  const closeById = useMemo(
    () => async (idS: string) => {
      const _toDelete = toDelete.slice();
      _toDelete.push(idS);
      setToDelete(_toDelete);
    },
    [toDelete]
  );

  const onClickCloseHandler = useMemo(
    () => (e: React.MouseEvent<HTMLButtonElement>) => {
      const { target }: { target: HTMLElement } = e as any;
      let button: HTMLButtonElement | null = null;
      switch (target.nodeName.toLowerCase()) {
        case 'path':
          button = target.parentElement?.parentElement as HTMLButtonElement;
          break;
        case 'svg':
          button = target.parentElement as HTMLButtonElement;
          break;
        case 'button':
          button = target as HTMLButtonElement;
          break;
        default:
      }
      if (!button) {
        return;
      }
      const idN = getButtonId(button);
      if (idN === null) {
        return;
      }
      closeById(idN);
    },
    [closeById]
  );

  /**
   * Close item
   */
  useEffect(() => {
    const closeHandler = async () => {
      Object.keys(alerts).every((key, i) => {
        const item = alerts[key];
        const del = getButtonId(getDangerouslyCurrent(item)?.querySelector('button'));
        if (del !== null && toDelete.indexOf(del) !== -1) {
          setDeletedI(del);
          const current = getDangerouslyCurrent(item);
          if (!current) {
            return false;
          }
          current.classList.remove(s.open);
          return false;
        }
        return true;
      });
    };
    closeHandler();
  }, [alerts, toDelete]);

  /**
   * Delete item
   */
  useEffect(() => {
    console.log(deletedId);
    if (deletedId !== '0') {
      setTimeout(() => {
        let toDeletedIndex = -1;
        toDelete.every((item, ind) => {
          if (item === deletedId) {
            toDeletedIndex = ind;
            const _alerts = { ...alerts };
            let deletedKey = '-1';
            Object.keys(alerts).every((key) => {
              const _item = alerts[key];
              const del = getButtonId(getDangerouslyCurrent(_item)?.querySelector('button'));
              if (del === deletedId) {
                deletedKey = key;
                return false;
              }
              return true;
            });
            delete _alerts[deletedKey];
            setAlerts(_alerts);
            return false;
          }
          return true;
        });
        const _toDelete = toDelete.slice();
        _toDelete.splice(toDeletedIndex, 1);
        setToDelete(_toDelete);
      }, ALERT_TRANSITION);
    }
  }, [deletedId, alerts, toDelete]);

  /**
   * Listen store alert
   */
  useEffect(() => {
    const getAlertIndex = () => {
      let index: number | null = 0;
      for (let i = 0; i < ALERT_COUNT_MAX; i++) {
        if (!alerts[i]) {
          index = i;
          break;
        }
      }
      return index;
    };
    const cleanSubs = storeAlert.subscribe(() => {
      const {
        alert: { message, status },
      } = storeAlert.getState();
      const _alerts = { ...alerts };
      const index = getAlertIndex();
      const id = v4();
      _alerts[index] = (
        <div
          key={getItemClassName(index)}
          ref={createRef()}
          style={{
            color: theme.black,
            backgroundColor:
              status === 'warn' ? theme.yellow : status === 'error' ? theme.red : theme.blue,
          }}
          className={clsx(s.item, ubuntu400.className, getItemClassName(index))}
        >
          {status === 'warn' ? (
            <WarnIcon color={theme.red} />
          ) : status === 'error' ? (
            <ErrorIcon color={theme.yellow} />
          ) : (
            <InfoIcon color={theme.black} />
          )}

          <p style={{ color: theme.black }} className={s.text}>
            {message}
          </p>
          <IconButton id={id} onClick={onClickCloseHandler}>
            <CloseCircleIcon color={theme.black} />
          </IconButton>
        </div>
      );
      setTimeout(() => {
        closeById(id);
      }, ALERT_TIMEOUT);
      setAlerts(_alerts);
    });
    return () => {
      cleanSubs();
    };
  }, [alerts, theme, onClickCloseHandler, closeById]);

  /**
   * Change class
   */
  useEffect(() => {
    Object.keys(alerts).forEach((key) => {
      const item = alerts[key];
      setTimeout(async () => {
        const current = getDangerouslyCurrent(item);
        if (!current) {
          return;
        }
        current.classList.add(s.open);
        await waitForTimeout(ALERT_TIMEOUT);
      }, 100);
    });
  }, [alerts]);

  useMemo(
    () =>
      Object.keys(alerts).forEach((key, index) => {
        const item = alerts[key];
        const current = getDangerouslyCurrent(item);
        if (!current) {
          return;
        }
        const { classList } = current;
        if (!classList.contains(getItemClassName(index))) {
          classList.forEach((classN) => {
            if (itemClassNameRegexp.test(classN)) {
              current.classList.remove(classN);
            }
          });
          current.classList.add(getItemClassName(index));
        }
      }),
    [alerts]
  );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <>
      {alerts[0]}
      {alerts[1]}
      {alerts[2]}
      {alerts[3]}
      {alerts[4]}
    </>
  );
}

export default Alert;
