import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Theme } from '@/Theme';
import { Ubuntu } from '@next/font/google';
import { LABEL_TRANSITION } from '@/utils/constants';
import s from './Input.module.scss';

const ubuntu = Ubuntu({ subsets: ['cyrillic', 'latin'], weight: '400', preload: true });

function Input({
  className,
  error,
  disabled,
  value,
  name,
  id,
  theme,
  colorActive,
  title,
  type,
  onBlur,
  onChange,
  required,
  success,
  fullWidth,
}: {
  disabled: boolean;
  value: string;
  name: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: Theme;
  id: string;
  colorActive?: boolean;
  type: React.HTMLInputTypeAttribute;
  // eslint-disable-next-line no-unused-vars
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  className?: string;
  error?: string;
  required?: boolean;
  title?: string;
  success?: boolean;
  fullWidth?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [gradient, setGradient] = useState<boolean>(false);

  const backgroundColor = colorActive ? theme.active : theme.paper;

  const style: React.CSSProperties = {
    color: theme.text,
    backgroundColor,
  };

  const onClick = () => {
    setGradient(true);
  };

  const _onBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    setGradient(value.length !== 0);
  };

  useEffect(() => {
    if (value === '') {
      setGradient(false);
    }
  }, [value]);

  return (
    <div className={clsx(s.wrapper, ubuntu.className)}>
      <input
        ref={inputRef}
        disabled={disabled}
        placeholder=" "
        id={id}
        value={value}
        title={title}
        onChange={onChange}
        onBlur={(e) => {
          _onBlur(e);
          if (onBlur) {
            onBlur(e);
          }
        }}
        onClick={onClick}
        required={required}
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
          className,
          fullWidth ? s.full__width : '',
          error ? s.error : success ? s.success : '',
          disabled ? s.disabled : ''
        )}
      />
      <label
        className={disabled ? s.disabled : ''}
        style={{
          color: theme.text,
          background: !gradient
            ? backgroundColor
            : `linear-gradient(to top, ${backgroundColor}, ${theme.paper} 65%)`,
          transition: `all ${LABEL_TRANSITION} ease-out`,
        }}
        htmlFor={id}
      >
        {name}
      </label>
      <span style={{ color: theme.yellow }} className={s.error}>
        {error}
      </span>
    </div>
  );
}

Input.defaultProps = {
  error: '',
  success: false,
  className: '',
  onBlur: undefined,
  fullWidth: false,
  required: false,
  title: undefined,
  colorActive: false,
};

export default Input;
