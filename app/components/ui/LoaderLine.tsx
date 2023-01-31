import clsx from 'clsx';
import s from './LoaderLine.module.scss';

function LoaderLine({ open }: { open: boolean }) {
  return (
    <div className={s.wrapper}>
      <div className={clsx(s.container, open ? s.open : '')} />
    </div>
  );
}

export default LoaderLine;
