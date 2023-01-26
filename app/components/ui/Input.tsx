import React from 'react';
import clsx from 'clsx';
import { Theme } from '@/Theme';
import { Ubuntu } from '@next/font/google';
import s from './Input.module.scss';

const ubuntu = Ubuntu({ subsets: ['cyrillic', 'latin'], weight: '400' });

function Input({
  className,
  error,
  load,
  disabled,
  value,
  name,
  id,
  theme,
  type,
  onBlur,
  onChange,
  success,
  fullWidth,
}: {
  load: boolean;
  disabled: boolean;
  value: string;
  name: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: Theme;
  id: string;
  type: React.HTMLInputTypeAttribute;
  // eslint-disable-next-line no-unused-vars
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  className?: string;
  error?: boolean;
  success?: boolean;
  fullWidth?: boolean;
}) {
  const style: React.CSSProperties = {
    color: theme.text,
    backgroundColor: theme.paper,
  };

  return (
    <div className={s.wrapper}>
      <input
        disabled={load || disabled}
        placeholder=" "
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required
        style={
          error
            ? {
                borderColor: theme.red,
                ...style,
              }
            : success
            ? { borderColor: theme.green, ...style }
            : { borderColor: theme.active, ...style }
        }
        type={type}
        className={clsx(
          ubuntu.className,
          className,
          fullWidth ? s.full__width : '',
          error ? s.error : success ? s.success : '',
          disabled ? s.disabled : ''
        )}
      />
      <label
        className={disabled ? s.disabled : ''}
        style={{ color: theme.text, background: theme.paper }}
        htmlFor={id}
      >
        {name}
      </label>
    </div>
  );
}

Input.defaultProps = {
  error: false,
  success: false,
  className: '',
  onBlur: undefined,
  fullWidth: false,
};

export default Input;
