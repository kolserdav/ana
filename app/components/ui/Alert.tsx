import { ubuntu400 } from '@/fonts/ubuntu';
import storeAlert from '@/store/alert';
import { Theme } from '@/Theme';
import { ALERT_TIMEOUT, ALERT_TRANSITION, ALERT_TRANSITION_Y } from '@/utils/constants';
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

let closed = false;
function Alert({ theme }: { theme: Theme }) {
  const [alerts, setAlerts] = useState<React.ReactElement[]>([]);
  const [toDelete, setToDelete] = useState<string[]>([]);

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

  useEffect(() => {
    const closeHandler = async () => {
      if (closed) {
        await waitForTimeout(0);
        await closeHandler();
        return;
      }
      let deletedIndex = -1;
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
        closed = true;
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
          closed = false;
        }, ALERT_TRANSITION);
      }
    };
    closeHandler();
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
      const id = v4();
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
    alerts.forEach((item) => {
      setTimeout(async () => {
        const current = getDangerouslyCurrent(item);
        if (!current) {
          return;
        }
        current.classList.add(s.open);
        closed = true;
        await waitForTimeout(ALERT_TIMEOUT);
        closed = false;
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
