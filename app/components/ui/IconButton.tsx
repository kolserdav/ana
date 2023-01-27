import clsx from 'clsx';
import s from './Button.module.scss';

function IconButton(
  props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) {
  const { className } = props;

  return <button className={clsx(s.wrapper, className)} type="button" {...props} />;
}

export default IconButton;
