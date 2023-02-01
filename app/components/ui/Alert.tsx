import { ubuntu400 } from '@/fonts/ubuntu';
import storeAlert from '@/store/alert';
import { Theme } from '@/Theme';
import { ALERT_ID_PREFIX, ALERT_TIMEOUT, ALERT_TRANSITION } from '@/utils/constants';
import { getDangerouslyCurrent } from '@/utils/lib';
import clsx from 'clsx';
import React, { createRef, useEffect, useMemo, useState } from 'react';
import CloseCircleIcon from '../icons/CloseCircle';
import ErrorIcon from '../icons/Error';
import InfoIcon from '../icons/Info';
import WarnIcon from '../icons/Warn';
import s from './Alert.module.scss';
import IconButton from './IconButton';

let deletedIndex = -1;
const getButtonId = (button: HTMLButtonElement | null) => {
  if (button === null) {
    return null;
  }
  let id = button.getAttribute('id');
  id = id?.replace(ALERT_ID_PREFIX, '') || null;
  if (!id) {
    return null;
  }
  return parseInt(id, 10);
};

const itemClassNameRegexp = /_i__\d+/;

const getItemClassName = (index: number) => s[`i__${index}`];

function Alert({ theme }: { theme: Theme }) {
  const [alerts, setAlerts] = useState<React.ReactElement[]>([]);
  const [toDelete, setToDelete] = useState<number[]>([]);

  const closeById = useMemo(
    () => (idN: number) => {
      const _toDelete = toDelete.slice();
      _toDelete.push(idN);
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

  useEffect(() => {
    alerts.forEach((item, i) => {
      const del = getButtonId(getDangerouslyCurrent(item)?.querySelector('button'));
      if (del !== null && toDelete.indexOf(del) !== -1) {
        deletedIndex = i;
        setTimeout(() => {
          const current = getDangerouslyCurrent(item);
          if (!current) {
            return;
          }
          current.classList.remove(s.open);
        }, 0);
      }
    });
    if (deletedIndex !== -1) {
      const _alerts = alerts.slice();
      setTimeout(() => {
        _alerts.splice(deletedIndex, 1);
        setAlerts(_alerts);
        let toDeletedIndex = -1;
        toDelete.forEach((_, ind) => {
          if (ind === deletedIndex) {
            toDeletedIndex = ind;
          }
        });
        const _toDelete = toDelete.slice();
        _toDelete.splice(toDeletedIndex, 1);
        setToDelete(_toDelete);
        deletedIndex = -1;
      }, ALERT_TRANSITION);
    }
  }, [alerts, toDelete]);

  /**
   * Listen store alert
   */
  useEffect(() => {
    const cleanSubs = storeAlert.subscribe(() => {
      const {
        alert: { message, status },
      } = storeAlert.getState();
      const _alerts = alerts.slice();
      const index = _alerts.length;
      _alerts.push(
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
          <IconButton id={`${ALERT_ID_PREFIX}${index}`} onClick={onClickCloseHandler}>
            <CloseCircleIcon color={theme.black} />
          </IconButton>
        </div>
      );
      /*
      setTimeout(() => {
        closeById(index);
      }, ALERT_TIMEOUT);
      */
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
    alerts.forEach((item) => {
      setTimeout(() => {
        const current = getDangerouslyCurrent(item);
        if (!current) {
          return;
        }
        current.classList.add(s.open);
      }, 100);
    });
  }, [alerts]);

  useMemo(
    () =>
      alerts.forEach((item, index) => {
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
  return <>{alerts}</>;
}

export default Alert;
