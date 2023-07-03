import clsx from 'clsx';
import React, { createRef, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { ubuntu400 } from '../../fonts/ubuntu';
import storeAlert from '../../store/alert';
import { Theme } from '../../Theme';
import { AlertProps } from '../../types';
import {
  ALERT_COUNT_MAX,
  ALERT_DURATION,
  ALERT_TRANSITION,
  ALERT_TRANSITION_Y,
} from '../../utils/constants';
import CloseCircleIcon from '../icons/CloseCircle';
import s from './Alert.module.scss';
import IconButton from './IconButton';

type AlertElement = AlertProps & { id: string; ref: React.RefObject<HTMLDivElement> };

const getButtonId = (button: HTMLButtonElement | null) => {
  const id = button?.getAttribute('id');
  if (!id) {
    return null;
  }
  return id;
};

const itemClassNameRegexp = /_i__\d+/;

const getItemClassName = (index: number) => s[`i__${index}`];

let mouseOver = '';
let activeIndex = -1;
let infs = 0;
let alertIds: string[] = [];

const timeouts: Record<string, NodeJS.Timeout> = {};

function Alert({ theme }: { theme: Theme }) {
  const [alerts, setAlerts] = useState<AlertElement[]>([]);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<string | null>(null);

  const closeById = (idS: string) => {
    setToDelete(idS);
  };

  const onClickCloseHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  };

  /**
   * Close item
   */
  useEffect(() => {
    const closeHandler = async () => {
      alerts.every((item) => {
        if (toDelete === item.id) {
          const { current } = item.ref;
          if (current) {
            current.classList.remove(s.open);
          }
          return false;
        }
        return true;
      });
    };
    if (toDelete) {
      closeHandler();
    }
  }, [alerts, toDelete]);

  /**
   * Delete item
   */
  useEffect(() => {
    const addDeleted = async () => {
      if (toDelete) {
        setTimeout(() => {
          setDeleted(toDelete);
        }, ALERT_TRANSITION);
        setToDelete(null);
      }
    };
    addDeleted();
  }, [toDelete]);

  /**
   * Listen store alert
   */
  useEffect(() => {
    const cleanSubs = storeAlert.subscribe(async () => {
      const {
        alert: { message, status, infinity },
      } = storeAlert.getState();
      if (infinity) {
        infs++;
      }
      const _alerts = alerts.slice();

      if (alertIds.length >= ALERT_COUNT_MAX) {
        await new Promise((resolve) => {
          setTimeout(() => {
            const immediateId = alertIds[0];
            if (immediateId) {
              if (immediateId !== mouseOver) {
                closeById(immediateId);
              }
              delete timeouts[immediateId];
            }
            resolve(0);
          }, ALERT_TRANSITION_Y * (ALERT_COUNT_MAX - _alerts.length));
        });
      }

      const id = v4();
      const infins = _alerts.filter((item) => item.infinity);
      const durationShift = _alerts[_alerts.length - infins.length - 1]
        ? _alerts.length - infins.length
        : _alerts[_alerts.length - 1]
        ? _alerts.length - 1
        : 0;
      const duration = infinity ? 0 : ALERT_DURATION + ALERT_TRANSITION * (durationShift / 2);
      timeouts[id] = setTimeout(() => {
        delete timeouts[id];
        if (!infinity) {
          if (id !== mouseOver) {
            closeById(id);
          }
        }
      }, duration);

      _alerts.push({
        message,
        status,
        id,
        infinity,
        ref: createRef<HTMLDivElement>(),
      });

      alertIds = _alerts.map((item) => item.id);
      setAlerts(_alerts);
    });
    return () => {
      cleanSubs();
    };
  }, [alerts, theme]);

  /**
   * Set item classes
   */
  useEffect(() => {
    alerts.forEach((item, index) => {
      const { current } = item.ref;
      if (!current) {
        return;
      }
      const { classList } = current;
      if (mouseOver === item.id) {
        current.classList.add(s.fixed);
      }
      if (!classList.contains(getItemClassName(index)) && mouseOver !== item.id) {
        classList.forEach((classN) => {
          if (itemClassNameRegexp.test(classN)) {
            current.classList.remove(classN);
          }
        });
        const _index = activeIndex !== -1 && index === activeIndex ? index - 1 : index;
        current.classList.add(getItemClassName(_index));
      } else if (activeIndex !== -1 && mouseOver !== item.id) {
        classList.remove(getItemClassName(index));
        current.classList.add(getItemClassName(index - 1));
      }
    });
  }, [alerts]);

  /**
   * Set open classes
   */
  useEffect(() => {
    alerts.forEach((item) => {
      const { current } = item.ref;
      if (!current) {
        return;
      }
      const { classList } = current;
      if (!classList.contains(s.open) && item.id !== deleted) {
        current.classList.add(s.open);
      }
    });
  }, [alerts, deleted]);

  /**
   * Listend deleted
   */
  useEffect(() => {
    if (deleted) {
      const _alerts = alerts.filter((item) => {
        const isDel = item.id === deleted;
        if (isDel && item.infinity) {
          infs--;
        }
        return !isDel;
      });
      alertIds = _alerts.map((item) => item.id);
      setAlerts(_alerts);
      setDeleted(null);
    }
  }, [alerts, deleted]);

  /**
   * Listen mouse
   */
  useEffect(() => {
    const mouseOverWrapper =
      ({ id }: AlertElement, index: number) =>
      () => {
        mouseOver = id;
        activeIndex = index;
      };
    const mouseOutWrapper =
      ({ id }: AlertElement, infinity: boolean) =>
      () => {
        setTimeout(() => {
          if (id !== mouseOver && !infinity) {
            closeById(id);
          }
        }, ALERT_DURATION);
        mouseOver = '';
        activeIndex = -1;
      };
    alerts.forEach((item, index) => {
      const { current } = item.ref;
      if (!current) {
        return;
      }
      current.addEventListener('mouseover', mouseOverWrapper(item, index));
      current.addEventListener('touchstart', mouseOverWrapper(item, index));
      current.addEventListener('mouseout', mouseOutWrapper(item, item.infinity));
      current.addEventListener('touchend', mouseOutWrapper(item, item.infinity));
      current.addEventListener('touchcancel', mouseOutWrapper(item, item.infinity));
    });
    return () => {
      alerts.forEach((item, index) => {
        const { current } = item.ref;
        if (!current) {
          return;
        }
        current.removeEventListener('mouseover', mouseOverWrapper(item, index));
        current.removeEventListener('touchstart', mouseOverWrapper(item, index));
        current.removeEventListener('mouseout', mouseOutWrapper(item, item.infinity));
        current.removeEventListener('touchend', mouseOutWrapper(item, item.infinity));
        current.removeEventListener('touchcancel', mouseOutWrapper(item, item.infinity));
      });
    };
  }, [alerts]);

  /**
   * Drop down deactivated
   */
  useEffect(() => {
    let interval = setInterval(() => {
      /** */
    }, Infinity);
    if (activeIndex !== -1 && alerts.length === 1) {
      const _activeIndex = parseInt(`${activeIndex}`, 10);
      interval = setInterval(() => {
        if (activeIndex === -1) {
          clearInterval(interval);
          const al = alerts[0];
          const { current } = al.ref;
          if (!current) {
            return;
          }
          setTimeout(() => {
            current.classList.remove(getItemClassName(_activeIndex));
            current.classList.add(getItemClassName(infs));
          }, ALERT_TRANSITION);
        }
      }, 10);
    }
    return () => {
      clearInterval(interval);
    };
  }, [alerts]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <>
      {alerts.map((item) => (
        <div
          key={item.id}
          draggable
          ref={item.ref}
          style={{
            color: theme.black,

            backgroundColor:
              item.status === 'warn'
                ? theme.yellow
                : item.status === 'error'
                ? theme.red
                : theme.blue,
          }}
          className={clsx(s.item, ubuntu400.className)}
        >
          <p style={{ color: theme.black }} className={s.text}>
            {item.message}
          </p>
          {item.infinity && (
            <IconButton titleHide theme={theme} id={item.id} onClick={onClickCloseHandler}>
              <CloseCircleIcon color={theme.black} />
            </IconButton>
          )}
        </div>
      ))}
    </>
  );
}

export default Alert;
