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
}: {
  checked: boolean;
  id: string;
  label: string;
  theme: Theme;
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line no-unused-vars
  cb?: (che: boolean) => void;
}) {
  return (
    <div className={s.wrapper}>
      <input
        onChange={(e) => {
          const val = e.target.checked;
          onChange(val);
          if (cb) {
            cb(val);
          }
        }}
        id={id}
        aria-label={label}
        type="checkbox"
        checked={checked}
        style={{ accentColor: theme.blue }}
      />
      <Typography variant="label" theme={theme} small>
        {label}
      </Typography>
    </div>
  );
}

Checkbox.defaultProps = {
  cb: undefined,
};

export default Checkbox;
