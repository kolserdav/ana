import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ubuntu300 } from '../../fonts/ubuntu';
import storeClick from '../../store/click';
import storeScroll from '../../store/scroll';
import { Theme } from '../../Theme';
import { checkClickBy, log } from '../../utils/lib';
import s from './Tooltip.module.scss';
import Typography from './Typography';
import { TOOLTIP_DURATION } from '../../utils/constants';

const POSITION_DEFAULT = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
};

function Tooltip({
  children,
  theme,
  length,
  closeOnClick,
  parentRef,
  withoutListenClick,
  remoteOpen,
  setRemoteOpen,
  withoutClose,
}: {
  parentRef: React.RefObject<HTMLElement>;
  children: string | React.ReactNode;
  theme: Theme;
  length?: number;
  closeOnClick?: boolean;
  withoutListenClick?: boolean;
  remoteOpen?: boolean;
  setRemoteOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  withoutClose?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState<boolean>();
  const [position, setPosition] = useState<typeof POSITION_DEFAULT>(POSITION_DEFAULT);

  const isString = typeof children === 'string';

  const openTooltip = useCallback(
    (value: boolean) => {
      setOpen(value);
      if (value && !withoutClose) {
        setTimeout(() => {
          setOpen(false);
          if (setRemoteOpen) {
            setRemoteOpen(false);
          }
        }, TOOLTIP_DURATION);
      }
    },
    [setRemoteOpen, withoutClose]
  );

  const onClick = useMemo(
    () => () => {
      const { current } = parentRef;
      if (!current || !children) {
        return;
      }

      const b = current.getBoundingClientRect();
      const { y, x, width: _width, height: _height } = b;
      const { innerWidth } = window;
      const pt = 20;
      let _length = 0;
      if (!isString) {
        _length = length || 200;
      } else {
        _length = children.length;
      }

      let cols = 4;
      let rows = 2;
      if (_length >= 10 && _length < 30) {
        cols = 7;
        rows = 3;
      } else if (_length >= 30 && _length < 50) {
        cols = 8;
        rows = 3;
      } else if (_length >= 50 && _length < 70) {
        cols = 8;
        rows = 4;
      } else if (_length >= 70 && _length < 90) {
        cols = 9;
        rows = 5;
      } else if (_length >= 90 && _length < 110) {
        cols = 10;
        rows = 5;
      } else if (_length >= 110 && _length < 130) {
        cols = 10;
        rows = 6;
      } else if (_length >= 130 && _length < 150) {
        cols = 11;
        rows = 7;
      } else if (_length >= 150) {
        cols = 12;
        rows = 8;
        log('warn', 'Tooltip length is too long', { _length, max: 150 });
      }
      // console.log({ rows, cols });
      const width = cols * pt;
      const height = rows * pt;
      const TOOLTIP_SHIFT = 8;
      const top =
        y + TOOLTIP_SHIFT > height ? y - rows * pt - TOOLTIP_SHIFT : y + _height + TOOLTIP_SHIFT;
      let left =
        innerWidth - x > width / 2 ? x + _width / 2 - (cols * pt) / 2 : x + _width / 2 - cols * pt;
      left = x < width / 2 ? _width / 2 : left;

      setPosition({
        left,
        top,
        width,
        height,
      });
      setTimeout(() => {
        openTooltip(true);
      }, 110);
    },
    [children, length, parentRef, isString, openTooltip]
  );

  /**
   * Handle click
   */
  useEffect(() => {
    const { current } = parentRef;

    if (!current || withoutListenClick) {
      return () => {
        /** */
      };
    }

    current.addEventListener('click', onClick);
    return () => {
      current.removeEventListener('click', onClick);
    };
  }, [parentRef, onClick, withoutListenClick]);

  /**
   * Listen remote open
   */
  useEffect(() => {
    if (remoteOpen !== undefined) {
      openTooltip(remoteOpen);
      if (remoteOpen) {
        onClick();
      }
    }
  }, [remoteOpen, onClick, openTooltip]);

  /**
   * Listen scroll
   */
  useEffect(() => {
    const cleanSubs = storeScroll.subscribe(() => {
      openTooltip(false);
    });
    return () => {
      cleanSubs();
    };
  }, [openTooltip]);

  /**
   * Listen click
   */
  useEffect(() => {
    const { current: _current } = ref;
    if (!_current) {
      return () => {
        /** */
      };
    }
    const cleanSubs = storeClick.subscribe(() => {
      const { clientX, clientY } = storeClick.getState();
      const clickBy = checkClickBy({ current: _current, clientX, clientY });
      if (open || remoteOpen) {
        let _open = true;
        if (!clickBy) {
          _open = false;
        } else if (closeOnClick) {
          _open = false;
        }
        if (withoutListenClick) {
          _open = false;
        }
        openTooltip(_open);
        if (setRemoteOpen) {
          setRemoteOpen(_open);
        }
      }
    });
    return () => {
      cleanSubs();
    };
  }, [ref, open, closeOnClick, remoteOpen, setRemoteOpen, withoutListenClick, openTooltip]);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: theme.text,
        color: theme.paper,
        left: `${position?.left}px`,
        top: `${position?.top}px`,
        width: `${position?.width}px`,
        height: `${position?.height}px`,
        border: withoutClose ? `-1px groove ${theme.active}` : 'none',
      }}
      className={clsx(s.wrapper, ubuntu300.className, open ? s.open : '')}
    >
      {isString ? (
        <Typography variant="span" theme={theme} styleName="vice-versa">
          {children}
        </Typography>
      ) : (
        children
      )}
    </div>
  );
}

Tooltip.defaultProps = {
  length: 0,
  closeOnClick: false,
  withoutListenClick: undefined,
  remoteOpen: undefined,
  setRemoteOpen: undefined,
  withoutClose: undefined,
};

export default Tooltip;
