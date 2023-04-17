import { Theme } from '../../Theme';
import s from './Checkbox.module.scss';

function Checkbox({
  checked,
  id,
  label,
  theme,
  onChange,
}: {
  checked: boolean;
  id: string;
  label: string;
  theme: Theme;
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className={s.wrapper}>
      <input
        onChange={(e) => {
          onChange(e.target.checked);
        }}
        id={id}
        aria-label={label}
        type="checkbox"
        checked={checked}
      />
      <label htmlFor={id} style={{ color: theme.text }}>
        {label}
      </label>
    </div>
  );
}

export default Checkbox;
