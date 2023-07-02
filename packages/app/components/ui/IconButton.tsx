import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import s from './IconButton.module.scss';
import { Theme } from '../../Theme';
import Typography from './Typography';
import Tooltip from './Tooltip';

const IconButton = forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    theme: Theme;
    touchStarted?: boolean;
    titleHide?: boolean;
    viceVersa?: boolean;
    small?: boolean;
  }
>((props, ref) => {
  const _props = useMemo(() => {
    const newProps = { ...props };
    delete newProps.touchStarted;
    delete newProps.titleHide;
    delete newProps.viceVersa;
    delete newProps.small;
    return newProps;
  }, [props]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);
  const { theme, title, touchStarted, viceVersa, small } = props;
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
      <div
        className={clsx(s.icon, small ? s.small : '')}
        ref={containerRef}
        onClick={onClick}
        role="button"
        tabIndex={-1}
        onKeyDown={() => {
          /** */
        }}
      >
        <button
          onContextMenu={onContextMenuOpen}
          className={s.wrapper}
          type="button"
          ref={ref}
          {..._props}
        />
        {!props.titleHide && (
          <Typography
            theme={theme}
            variant="span"
            className={s.text}
            smaller
            styleName={viceVersa ? 'vice-versa' : undefined}
            align="center"
          >
            {title}
          </Typography>
        )}
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
  titleHide: undefined,
  viceVersa: undefined,
  small: undefined,
};

export default IconButton;
