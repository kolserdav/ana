import clsx from 'clsx';
import { Theme } from '../../Theme';
import { ubuntu500 } from '../../fonts/ubuntu';
import s from './Cheep.module.scss';
import CloseIcon from '../icons/Close';
import IconButton from './IconButton';

function Cheep({
  theme,
  children,
  onClick,
  add,
  disabled,
}: {
  theme: Theme;
  children: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  add?: boolean;
  disabled?: boolean;
}) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { code } = e;
    if (code === 'Enter') {
      if (!disabled) {
        onClick();
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (!disabled) {
          onClick(e);
        }
      }}
      className={clsx(s.wrapper, ubuntu500, disabled ? s.disabled : '')}
      style={{ backgroundColor: add ? theme.cyan : theme.blue, color: theme.black }}
    >
      <div className={s.container}>
        {add && <span className={s.symbol}>+ </span>}
        <span className={clsx(s.text, !add ? s.del : '')}>{children}</span>
        {!add && <span className={s.symbol}> -</span>}
      </div>
    </div>
  );
}

Cheep.defaultProps = {
  add: false,
  disabled: false,
};

export default Cheep;
