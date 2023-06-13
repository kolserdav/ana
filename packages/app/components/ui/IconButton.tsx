import { forwardRef, useEffect, useRef, useState } from 'react';
import s from './IconButton.module.scss';
import { Theme } from '../../Theme';
import Tooltip from './Tooltip';

const IconButton = forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    theme: Theme;
    touchStarted?: boolean;
  }
>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);
  const { theme, title, touchStarted } = props;
  const onContextMenuOpen = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (title) {
      ev.preventDefault();
      if (!touchStarted) {
        setOpenTooltip(true);
      }
    }
  };

  /**
   * Close while recognize
   */
  useEffect(() => {
    if (touchStarted) {
      setOpenTooltip(false);
    }
  }, [touchStarted]);

  const onClick =
    !props.onClick && !ref
      ? () => {
          setOpenTooltip(true);
        }
      : undefined;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <>
      <div ref={containerRef}>
        <button
          onClick={onClick}
          onContextMenu={onContextMenuOpen}
          className={s.wrapper}
          type="button"
          ref={ref}
          {...props}
        />
      </div>
      <Tooltip
        withoutListenClick
        remoteOpen={openTooltip}
        setRemoteOpen={setOpenTooltip}
        theme={theme}
        parentRef={containerRef}
      >
        {title}
      </Tooltip>
    </>
  );
});

IconButton.displayName = 'IconButton';

IconButton.defaultProps = {
  touchStarted: undefined,
};

export default IconButton;
