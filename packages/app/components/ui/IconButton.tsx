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
    withoutContext?: boolean;
  }
>((props, ref) => {
  const _props = useMemo(() => {
    const newProps = { ...props };
    delete newProps.touchStarted;
    delete newProps.titleHide;
    delete newProps.viceVersa;
    delete newProps.small;
    delete newProps.withoutContext;
    return newProps;
  }, [props]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);
  const { theme, title, touchStarted, viceVersa, small } = props;
  const onContextMenuOpen = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (title) {
      ev.preventDefault();
      if (!touchStarted && !props.withoutContext) {
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
      <div className={clsx(s.icon, small ? s.small : '')} ref={containerRef}>
        <button
          onClick={onClick}
          onContextMenu={onContextMenuOpen}
          className={s.wrapper}
          type="button"
          ref={ref}
          {..._props}
        />
      </div>
      {!props.titleHide && (
        <Typography
          theme={theme}
          variant="span"
          className={s.icon__text}
          smaller
          styleName={viceVersa ? 'vice-versa' : undefined}
          align="center"
        >
          {title}
        </Typography>
      )}
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
  withoutContext: undefined,
};

export default IconButton;
