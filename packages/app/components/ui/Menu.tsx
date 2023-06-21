import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import storeClick from '../../store/click';
import storeMenuOpen, { changeMenuOpen } from '../../store/menuOpen';
import { Theme } from '../../Theme';
import { MENU_TRANSITION } from '../../utils/constants';
import { checkClickBy } from '../../utils/lib';
import MenuIcon from '../icons/Menu';
import MenuOpenIcon from '../icons/MenuOpen';
import s from './Menu.module.scss';

function Menu({
  theme,
  children,
  openMenu,
}: {
  theme: Theme;
  children: React.ReactNode | React.ReactNode[];
  openMenu: string;
}) {
  const menuRef = useRef<HTMLMenuElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [_open, _setOpen] = useState<boolean>(false);

  const onClickOpen = useCallback(() => {
    storeMenuOpen.dispatch(
      changeMenuOpen({
        menuOpen: !open,
      })
    );
    setOpen(!open);
    setTimeout(() => {
      _setOpen(!_open);
    }, MENU_TRANSITION);
  }, [open, _open]);

  /**
   * Listen document click
   */
  useEffect(() => {
    const cleanSubs = storeClick.subscribe(() => {
      const { current } = menuRef;
      const { current: button } = buttonRef;
      if (current && open && button) {
        const { clientX, clientY } = storeClick.getState();
        if (button.firstElementChild === null) {
          return;
        }
        if (
          !checkClickBy({ clientX, clientY, current }) &&
          !checkClickBy({ clientX, clientY, current: button }) &&
          !checkClickBy({ clientX, clientY, current: button.firstElementChild })
        ) {
          onClickOpen();
        }
      }
    });
    return () => {
      cleanSubs();
    };
  }, [open, menuRef, onClickOpen]);

  return (
    <div className={s.wrapper}>
      <button
        title={openMenu}
        ref={buttonRef}
        type="button"
        onClick={onClickOpen}
        className={clsx(s.button, open ? s.open : '')}
      >
        {_open ? <MenuOpenIcon color={theme.text} /> : <MenuIcon color={theme.text} />}
      </button>
      <menu
        ref={menuRef}
        className={clsx(s.container, open ? s.open : '')}
        style={{
          color: theme.text,
          backgroundColor: theme.paper,
          boxShadow: `inset 1px -1px 4px 1px ${theme.contrast}`,
        }}
      >
        {children}
      </menu>
    </div>
  );
}

export default Menu;
