import { forwardRef, useMemo } from 'react';
import { Theme } from '../../Theme';
import s from './Select.module.scss';
import { ubuntu500 } from '../../fonts/ubuntu';

interface AdditionSelectProps {
  theme: Theme;
  active?: boolean;
}

const Select = forwardRef<
  HTMLSelectElement,
  Omit<
    React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
    'className'
  > &
    AdditionSelectProps
>((_props, ref) => {
  const { theme, 'aria-label': label, id, active } = _props;

  const props = useMemo(() => {
    const newProps: Omit<
      React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
      'className'
    > &
      Partial<AdditionSelectProps> = { ..._props };
    delete newProps.theme;
    delete newProps.active;
    return newProps;
  }, [_props]);
  return (
    <div className={s.wrapper}>
      <label
        className={ubuntu500.className}
        style={{ color: theme.text, backgroundColor: theme.paper }}
        htmlFor={id}
      >
        {label}
      </label>
      <select
        ref={ref}
        style={{
          backgroundColor: active ? theme.active : theme.paper,
          color: theme.text,
          borderColor: active ? theme.active : theme.paper,
        }}
        className={ubuntu500.className}
        {...props}
      />
    </div>
  );
});

Select.displayName = 'Select';

Select.defaultProps = {
  active: undefined,
};

export default Select;
