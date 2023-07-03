import clsx from 'clsx';
import { Theme } from '../../Theme';
import s from './Switch.module.scss';

function Switch({
  on,
  theme,
  onClick,
  viceVersa,
}: {
  on: boolean;
  theme: Theme;
  // eslint-disable-next-line no-unused-vars
  onClick: (value: boolean) => void;
  viceVersa?: boolean;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
    <div
      role="button"
      onClick={() => {
        onClick(!on);
      }}
      className={clsx(s.wrapper)}
      style={{ backgroundColor: viceVersa ? theme.paper : on ? theme.text : theme.active }}
    >
      <div
        className={clsx(s.round, on ? s.active : s.disabled)}
        style={{ backgroundColor: on ? theme.cyan : theme.blue, opacity: on ? 1 : 0.4 }}
      />
    </div>
  );
}

Switch.defaultProps = {
  viceVersa: undefined,
};

export default Switch;
