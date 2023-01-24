import React, { useMemo } from 'react';
import clsx from 'clsx';
import { v4 } from 'uuid';
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
  onBlur,
  onChange,
  success,
}: {
  load: boolean;
  disabled: boolean;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: Theme;
  id: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  className?: string;
  error?: boolean;
  success?: boolean;
}) {
  const style: React.CSSProperties = {
    color: theme.text,
    backgroundColor: theme.paper,
  };

  return (
    <div className={s.inner__box}>
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
        type="text"
        className={clsx(
          ubuntu.className,
          className,
          s.input,
          error ? s.error : success ? s.success : '',
          disabled ? s.disabled : ''
        )}
      />
      <label
        className={clsx(s.input__label, disabled ? s.disabled : '')}
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
};

export default Input;
