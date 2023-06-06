import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import s from './Spoiler.module.scss';
import Typography from './Typography';
import { Theme } from '../../Theme';
import ChevronRightIcon from '../icons/ChevronRight';
import { SPOILER_BORDER_WIDTH } from '../../utils/constants';

function Spoiler({
  children,
  summary,
  theme,
  open,
  setOpen,
  className,
  height,
}: {
  children: React.ReactNode;
  summary: string;
  open: boolean;
  theme: Theme;
  // eslint-disable-next-line no-unused-vars
  setOpen: (val: boolean) => void;
  className?: string;
  height?: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  /**
   * set block height
   */
  useEffect(() => {
    if (height) {
      if (contentHeight !== height) {
        setContentHeight(height);
      }
      return;
    }
    const { current } = contentRef;
    if (!current) {
      return;
    }
    const { clientHeight } = current;
    setContentHeight(clientHeight);
  }, [open, children, height, contentHeight]);

  const onClick = () => {
    const val = !open;
    setOpen(val);
  };

  return (
    <div className={clsx(s.wrapper, className || '')}>
      <summary
        style={{ borderColor: theme.active }}
        className={clsx(s.summary, open ? s.summary__open : '')}
        onClick={onClick}
      >
        <div className={clsx(s.summary__icon, open ? s.summary__icon__open : '')}>
          <ChevronRightIcon color={theme.text} />
        </div>
        <Typography theme={theme} large variant="span">
          {summary}
        </Typography>
      </summary>
      {!height && (
        <div className={s.hidden} ref={contentRef}>
          {children}
        </div>
      )}
      <div
        style={{
          height: `${open ? contentHeight + SPOILER_BORDER_WIDTH * 2 : 0}px`,
          transition: 'all 0.3s ease',
        }}
        className={s.content}
      >
        {children}
      </div>
    </div>
  );
}

Spoiler.defaultProps = {
  className: undefined,
  height: undefined,
};

export default Spoiler;
