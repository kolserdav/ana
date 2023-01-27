import { Theme } from '@/Theme';
import { MENU_TRANSITION } from '@/utils/constants';
import { setBodyScroll } from '@/utils/lib';
import clsx from 'clsx';
import { useState } from 'react';
import MenuIcon from '../icons/Menu';
import MenuOpenIcon from '../icons/MenuOpen';
import s from './Menu.module.scss';

function Menu({ theme }: { theme: Theme }) {
  const [open, setOpen] = useState<boolean>(false);
  const [_open, _setOpen] = useState<boolean>(false);

  const onClickOpen = () => {
    setBodyScroll(open);
    setOpen(!open);
    setTimeout(() => {
      _setOpen(!_open);
    }, MENU_TRANSITION);
  };

  return (
    <div className={s.wrapper}>
      <button type="button" onClick={onClickOpen} className={clsx(s.button, open ? s.open : '')}>
        {_open ? <MenuOpenIcon color={theme.text} /> : <MenuIcon color={theme.text} />}
      </button>
      <div
        className={clsx(s.container, open ? s.open : '')}
        style={{
          color: theme.text,
          backgroundColor: theme.paper,
          boxShadow: `inset 1px 1px 1px 1px ${theme.contrast}`,
        }}
      >
        Container
      </div>
    </div>
  );
}

export default Menu;
