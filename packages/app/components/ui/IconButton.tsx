import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
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
  const _props = useMemo(() => {
    const newProps = { ...props };
    delete newProps.touchStarted;
    return newProps;
  }, [props]);

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
    <div className={s.wrapper}>
      <div ref={containerRef}>
        <button
          onClick={onClick}
          onContextMenu={onContextMenuOpen}
          className={s.wrapper}
          type="button"
          ref={ref}
          {..._props}
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
    </div>
  );
});

IconButton.displayName = 'IconButton';

IconButton.defaultProps = {
  touchStarted: undefined,
};

export default IconButton;
