import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ubuntu300 } from '../../fonts/ubuntu';
import storeClick from '../../store/click';
import storeScroll from '../../store/scroll';
import { Theme } from '../../Theme';
import { checkClickBy, log } from '../../utils/lib';
import s from './Tooltip.module.scss';

const POSITION_DEFAULT = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
};

function Tooltip({
  current,
  children,
  theme,
}: {
  current: HTMLElement | null;
  children: string;
  theme: Theme;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState<boolean>();
  const [position, setPosition] = useState<typeof POSITION_DEFAULT>(POSITION_DEFAULT);

  /**
   * Handle click
   */
  useEffect(() => {
    if (!current) {
      return () => {
        /** */
      };
    }
    const onClick = () => {
      const b = current.getBoundingClientRect();
      const { y, x, width: _width, height: _height, right } = b;
      const { innerWidth } = window;
      const pt = 20;
      const { length } = children;
      let cols = 4;
      let rows = 1;
      if (length >= 10 && length < 30) {
        cols = 4;
        rows = 3;
      } else if (length >= 30 && length < 50) {
        cols = 6;
        rows = 3;
      } else if (length >= 50 && length < 70) {
        cols = 8;
        rows = 4;
      } else if (length >= 70 && length < 90) {
        cols = 9;
        rows = 5;
      } else if (length >= 90 && length < 110) {
        cols = 10;
        rows = 5;
      } else if (length >= 110 && length < 130) {
        cols = 10;
        rows = 6;
      } else if (length >= 130 && length < 150) {
        cols = 11;
        rows = 7;
      } else {
        cols = 12;
        rows = 8;
        log('warn', 'Tooltip length is too long', { length, max: 150 });
      }
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
        setOpen(true);
      }, 110);
    };
    current.addEventListener('click', onClick);
    return () => {
      current.removeEventListener('click', onClick);
    };
  }, [current, children]);

  /**
   * Listen scroll
   */
  useEffect(() => {
    const cleanSubs = storeScroll.subscribe(() => {
      setOpen(false);
    });
    return () => {
      cleanSubs();
    };
  }, []);

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
      if (!checkClickBy({ current: _current, clientX, clientY }) && open) {
        setOpen(false);
      }
    });
    return () => {
      cleanSubs();
    };
  }, [ref, open]);

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
      }}
      className={clsx(s.wrapper, ubuntu300.className, open ? s.open : '')}
    >
      {children}
    </div>
  );
}

export default Tooltip;
