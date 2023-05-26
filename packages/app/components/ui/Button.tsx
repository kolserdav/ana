import clsx from 'clsx';
import { useState } from 'react';
import { ubuntu500 } from '../../fonts/ubuntu';
import { Theme } from '../../Theme';
import s from './Button.module.scss';

function Button({
  onClick,
  disabled,
  theme,
  error,
  children,
  title,
  className,
  colorReverse,
  classNameWrapper,
}: {
  children: React.ReactNode | string;
  theme: Theme;
  title?: string;
  disabled?: boolean;
  error?: string;
  colorReverse?: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  classNameWrapper?: string;
}) {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <div className={clsx(s.wrapper, ubuntu500.className, classNameWrapper || '')}>
      <button
        title={title}
        disabled={disabled}
        onClick={onClick}
        type="button"
        className={clsx(className, s.button, disabled ? s.disabled : '')}
        style={
          isHover
            ? { borderColor: theme.active }
            : {
                background: colorReverse ? theme.paper : theme.text,
                color: colorReverse ? theme.text : theme.paper,
              }
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </button>
      <span className={s.error} style={{ color: theme.red }}>
        {error}
      </span>
    </div>
  );
}

Button.defaultProps = {
  className: '',
  disabled: false,
  error: '',
  title: '',
  colorReverse: false,
  classNameWrapper: undefined,
};

export default Button;
