import { Theme } from '@/Theme';
import clsx from 'clsx';
import s from './Switch.module.scss';

function Switch({
  on,
  theme,
  onClick,
}: {
  on: boolean;
  theme: Theme;
  // eslint-disable-next-line no-unused-vars
  onClick: (value: boolean) => void;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
    <div
      role="button"
      onClick={() => {
        onClick(!on);
      }}
      className={clsx(s.wrapper)}
      style={{ backgroundColor: theme.text }}
    >
      <div
        className={clsx(s.round, on ? s.active : '')}
        style={{ backgroundColor: on ? theme.blue : theme.active }}
      />
    </div>
  );
}

export default Switch;
