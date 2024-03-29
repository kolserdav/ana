import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Theme } from '../../Theme';
import { LABEL_TRANSITION } from '../../utils/constants';
import { ubuntu500 } from '../../fonts/ubuntu';
import s from './Input.module.scss';

const Input = forwardRef<
  HTMLInputElement,
  {
    disabled?: boolean;
    value?: string | readonly string[];
    name?: string | React.ReactNode;
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
    min?: string | number;
    max?: string | number;
    multiple?: boolean;
    hidden?: boolean;
    desc?: string;
    accept?: string;
    classWrapper?: string;
    defaultValue?: string;
    maxLength?: number;
    dropdown?: { text: string | null; onClick: () => void }[];
  }
>(
  (
    {
      accept,
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
      min,
      max,
      multiple,
      hidden,
      desc,
      classWrapper,
      defaultValue,
      maxLength,
      dropdown,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [gradient, setGradient] = useState<boolean>(false);

    const backgroundColor = colorActive ? theme.active : theme.paper;

    const style: React.CSSProperties = {
      color: theme.text,
      backgroundColor,
    };

    const onClick = () => {
      if (colorActive) {
        setGradient(true);
      }
    };

    const _onBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
      if (colorActive) {
        setGradient(
          value?.length !== 0 || (defaultValue !== undefined && defaultValue?.length !== 0)
        );
      }
    };

    useEffect(() => {
      setGradient(value !== '');
    }, [value]);

    const _dropdown = useMemo(() => {
      if (!dropdown) {
        return undefined;
      }
      if (dropdown[0].text === value) {
        return undefined;
      }
      return dropdown;
    }, [value, dropdown]);

    return (
      <div
        role="button"
        tabIndex={-1}
        onKeyDown={() => {
          /** */
        }}
        onClick={onClick}
        className={clsx(
          s.wrapper,
          classWrapper || '',
          ubuntu500.className,
          hidden ? s.hidden : '',
          fullWidth ? s.full__width : ''
        )}
      >
        <input
          ref={ref || inputRef}
          disabled={disabled}
          placeholder=" "
          id={id}
          accept={accept}
          multiple={multiple}
          value={value}
          title={title}
          maxLength={maxLength}
          min={min}
          max={max}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={(e) => {
            _onBlur(e);
            if (onBlur) {
              onBlur(e);
            }
          }}
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
        {name && (
          <label
            className={disabled ? s.disabled : ''}
            style={{
              color: theme.text,
              background: !gradient
                ? disabled
                  ? 'transparent'
                  : backgroundColor
                : `linear-gradient(to top, ${backgroundColor}, ${theme.paper} 65%)`,
              transition: !gradient
                ? `all ${LABEL_TRANSITION} ease-out`
                : `all ${LABEL_TRANSITION} ease-in`,
            }}
            htmlFor={id}
          >
            {name}
          </label>
        )}
        {_dropdown && (
          <div
            style={{ backgroundColor: theme.text, color: theme.paper }}
            className={clsx(s.dropdown, (_dropdown?.length || 0) !== 0 ? s.open : '')}
          >
            {_dropdown.map((item) => (
              <div
                key={item.text}
                onClick={item.onClick}
                role="button"
                tabIndex={-1}
                onKeyDown={() => {
                  // TODO
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
        )}

        <span className={clsx(s.desc, disabled ? s.disabled : '')}>
          <span style={{ color: theme.yellow }}>{error}</span>
          <span style={{ color: theme.text }}>{desc}</span>
        </span>
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.defaultProps = {
  error: '',
  success: false,
  className: '',
  onBlur: undefined,
  fullWidth: false,
  required: false,
  title: undefined,
  colorActive: false,
  disabled: false,
  min: undefined,
  max: undefined,
  multiple: undefined,
  hidden: undefined,
  desc: undefined,
  accept: undefined,
  classWrapper: undefined,
  defaultValue: undefined,
  value: undefined,
  maxLength: undefined,
  name: undefined,
  dropdown: undefined,
};

export default Input;
