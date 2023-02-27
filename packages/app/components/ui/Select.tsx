import { Theme } from '../../Theme';
import s from './Select.module.scss';
import { ubuntu500 } from '../../fonts/ubuntu';

function Select(
  props: Omit<
    React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
    'className'
  > & { theme: Theme }
) {
  const { theme, 'aria-label': label, id } = props;
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
        style={{ backgroundColor: theme.paper, color: theme.text, borderColor: theme.active }}
        className={ubuntu500.className}
        {...props}
      />
    </div>
  );
}

export default Select;
