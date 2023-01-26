import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Theme } from '@/Theme';
import { Ubuntu } from '@next/font/google';
import { LABEL_TRANSITION } from '@/utils/constants';
import s from './Input.module.scss';

const ubuntu = Ubuntu({ subsets: ['cyrillic', 'latin'], weight: '400', preload: true });

function Input({
  className,
  error,
  load,
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
  load: boolean;
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
  error?: boolean;
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

  return (
    <div className={s.wrapper}>
      <input
        ref={inputRef}
        disabled={load || disabled}
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
          ubuntu.className,
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
    </div>
  );
}

Input.defaultProps = {
  error: false,
  success: false,
  className: '',
  onBlur: undefined,
  fullWidth: false,
  required: false,
  title: undefined,
  colorActive: false,
};

export default Input;
