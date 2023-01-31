import { Theme } from '@/Theme';
import { Ubuntu } from '@next/font/google';
import clsx from 'clsx';
import { useState } from 'react';
import s from './Button.module.scss';

const ubuntu = Ubuntu({ subsets: ['cyrillic', 'latin'], weight: '500', preload: true });

function Button({
  onClick,
  disabled,
  theme,
  error,
  children,
  className,
}: {
  children: React.ReactNode | string;
  theme: Theme;
  disabled?: boolean;
  error?: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}) {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <div className={clsx(s.wrapper, ubuntu.className)}>
      <button
        disabled={disabled}
        onClick={onClick}
        type="button"
        className={clsx(className, s.button, disabled ? s.disabled : '')}
        style={
          isHover
            ? { borderColor: theme.active }
            : {
                background: theme.text,
                color: theme.paper,
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
};

export default Button;