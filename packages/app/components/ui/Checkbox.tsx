import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { Theme } from '../../Theme';
import s from './Checkbox.module.scss';
import Typography from './Typography';

function Checkbox({
  checked,
  id,
  label,
  theme,
  onChange,
  cb,
  disabled,
  className,
  indeterminate,
}: {
  checked: boolean;
  id: string;
  label?: string | React.ReactNode;
  theme: Theme;
  onChange: (val: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  cb?: (che: boolean) => void;
  disabled?: boolean;
  className?: string;
  indeterminate?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  /**
   * Set indeterminate
   */
  useEffect(() => {
    const { current } = ref;
    if (!current) {
      return;
    }
    current.indeterminate = indeterminate || false;
  }, [indeterminate]);

  return (
    <div className={clsx(s.wrapper, className || '')}>
      <input
        disabled={disabled}
        onChange={(e) => {
          const val = e.target.checked;
          onChange(val);
          if (cb) {
            cb(val);
          }
        }}
        id={id}
        ref={ref}
        aria-label={typeof label === 'string' ? label : undefined}
        type="checkbox"
        checked={checked}
        style={{ accentColor: theme.blue }}
      />
      {typeof label === 'string' ? (
        <Typography variant="label" theme={theme} small>
          {label}
        </Typography>
      ) : (
        label || undefined
      )}
    </div>
  );
}

Checkbox.defaultProps = {
  cb: undefined,
  disabled: undefined,
  label: undefined,
  className: undefined,
  indeterminate: undefined,
};

export default Checkbox;
