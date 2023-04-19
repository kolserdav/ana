import clsx from 'clsx';
import { useRef } from 'react';
import { Theme } from '../../Theme';
import { ubuntu500 } from '../../fonts/ubuntu';
import s from './Cheep.module.scss';
import IconButton from './IconButton';
import DotsHorisontalIcon from '../icons/DotsHorisontal';
import Tooltip from './Tooltip';

function Cheep({
  theme,
  children,
  onClick,
  add,
  disabled,
  menuChildren,
  menuChildrenLength,
}: {
  theme: Theme;
  children: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  add?: boolean;
  disabled?: boolean;
  menuChildren?: React.ReactNode | React.ReactNode[];
  menuChildrenLength?: number;
}) {
  const menuRef = useRef(null);

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
      className={clsx(s.wrapper, ubuntu500, disabled ? s.disabled : '')}
      style={{ backgroundColor: add ? theme.cyan : theme.blue, color: theme.black }}
    >
      <div className={s.container}>
        <div
          className={s.active}
          role="button"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          onClick={(e) => {
            if (!disabled) {
              onClick(e);
            }
          }}
        >
          {add && <span className={s.symbol}>+ </span>}
          <span className={clsx(s.text, !add ? s.del : '')}>{children}</span>
          {!add && <span className={s.symbol}> -</span>}
        </div>
        {add && menuChildren && (
          <div className={s.delete}>
            <IconButton ref={menuRef}>
              <DotsHorisontalIcon color={theme.text} />
            </IconButton>
            <Tooltip
              closeOnClick
              theme={theme}
              parentRef={menuRef}
              length={menuChildrenLength || 50}
            >
              {menuChildren}
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

Cheep.defaultProps = {
  add: false,
  disabled: false,
  menuChildren: undefined,
  menuChildrenLength: undefined,
};

export default Cheep;
