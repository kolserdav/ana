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
}: {
  checked: boolean;
  id: string;
  label: string | React.ReactNode;
  theme: Theme;
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line no-unused-vars
  cb?: (che: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={s.wrapper}>
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
        label
      )}
    </div>
  );
}

Checkbox.defaultProps = {
  cb: undefined,
  disabled: undefined,
};

export default Checkbox;
