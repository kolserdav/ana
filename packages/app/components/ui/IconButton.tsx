import { forwardRef } from 'react';
import s from './IconButton.module.scss';

const IconButton = forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <button className={s.wrapper} type="button" ref={ref} {...props} />
));

IconButton.displayName = 'IconButton';

export default IconButton;
