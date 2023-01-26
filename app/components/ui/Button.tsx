import { Theme } from '@/Theme';
import { Ubuntu } from '@next/font/google';
import clsx from 'clsx';
import { useState } from 'react';
import s from './Button.module.scss';

const ubuntu = Ubuntu({ subsets: ['cyrillic', 'latin'], weight: '500', preload: true });

function Button({
  load,
  onClick,
  disabled,
  theme,
  children,
  className,
}: {
  load: boolean;
  children: React.ReactNode | string;
  theme: Theme;
  disabled?: boolean;
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
    <div className={s.wrapper}>
      <button
        disabled={disabled || load}
        onClick={onClick}
        type="button"
        className={clsx(ubuntu.className, className, s.button, load || disabled ? s.disabled : '')}
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
    </div>
  );
}

Button.defaultProps = {
  className: '',
  disabled: false,
};

export default Button;
