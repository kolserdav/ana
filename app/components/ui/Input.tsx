import React, { useMemo } from 'react';
import clsx from 'clsx';
import { v4 } from 'uuid';
import s from './Input.module.scss';

function Input({
  className,
  error,
  load,
  disabled,
  value,
  name,
  onBlur,
  onChange,
  success,
}: {
  load: boolean;
  disabled: boolean;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  className?: string;
  error?: boolean;
  success?: boolean;
}) {
  const id = useMemo(() => v4(), []);

  return (
    <div className={s.inner__box}>
      <input
        disabled={load || disabled}
        placeholder=" "
        id="last-name"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required
        type="text"
        className={clsx(
          className,
          s.input,
          // eslint-disable-next-line no-nested-ternary
          error ? s.error : success ? s.success : '',
          disabled ? s.disabled : ''
        )}
      />
      <label className={clsx(s.input__label, disabled ? s.disabled : '')} htmlFor="last-name">
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
