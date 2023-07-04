import clsx from 'clsx';
import { useRef } from 'react';
import { Theme } from '../../Theme';
import { ubuntu300, ubuntu500 } from '../../fonts/ubuntu';
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
  postfix,
}: {
  theme: Theme;
  children: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  add?: boolean;
  disabled?: boolean;
  menuChildren?: React.ReactNode | React.ReactNode[];
  menuChildrenLength?: number;
  postfix?: string;
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
          <span
            className={s.symbol}
            style={{ color: theme.text, textShadow: `0px 0px 1px ${theme.yellow}` }}
          >
            {add ? '+' : '-'}{' '}
          </span>
          <span className={clsx(s.text, ubuntu300.className)}>{children}</span>
          {postfix && (
            <div
              style={{ color: theme.contrast, textShadow: `0px 0px 1px ${theme.yellow}` }}
              className={s.postfix}
            >
              {postfix}
            </div>
          )}
        </div>

        {add && menuChildren && (
          <div className={s.postfix}>
            <IconButton theme={theme} ref={menuRef} titleHide small>
              <DotsHorisontalIcon color={theme.text} withoutScale />
            </IconButton>
            <Tooltip
              withoutClose
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
  postfix: undefined,
};

export default Cheep;
