import s from './IconButton.module.scss';

function IconButton(
  props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <button className={s.wrapper} type="button" {...props} />;
}

export default IconButton;
