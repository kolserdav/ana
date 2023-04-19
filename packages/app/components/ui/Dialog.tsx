import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import storeClick from '../../store/click';
import { Theme } from '../../Theme';
import { checkClickBy, setBodyScroll } from '../../utils/lib';
import s from './Dialog.module.scss';

function Dialog({
  theme,
  open,
  children,
  onClose,
  className,
}: {
  theme: Theme;
  open: boolean;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  onClose?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Change body scroll
   */
  useEffect(() => {
    setBodyScroll(!open);
  }, [open]);

  /**
   * LIsten close
   */
  useEffect(() => {
    let cleanSubs = () => {
      /** */
    };
    setTimeout(() => {
      if (onClose && open) {
        cleanSubs = storeClick.subscribe(() => {
          const { current } = ref;
          if (!current) {
            return;
          }
          const { clientX, clientY } = storeClick.getState();
          if (!checkClickBy({ clientX, clientY, current })) {
            onClose(false);
          }
        });
      }
    }, 250);
    return () => {
      cleanSubs();
    };
  }, [onClose, open]);

  return (
    <div className={clsx(s.wrapper, open ? s.open : '')}>
      <div
        ref={ref}
        className={clsx(s.container, className || '')}
        style={{
          color: theme.text,
          backgroundColor: theme.paper,
          boxShadow: `1px 1px 8px ${theme.active}, -1px -1px 8px ${theme.contrast}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

Dialog.displayName = 'Tooltip';

Dialog.defaultProps = {
  onClose: undefined,
  className: undefined,
};

export default Dialog;
