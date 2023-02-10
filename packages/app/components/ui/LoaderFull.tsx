import clsx from 'clsx';
import s from './LoaderFull.module.scss';
import LoaderIcon from '../icons/LoaderIcon';

function LoaderFull({ open, noOpacity }: { open: boolean; noOpacity?: boolean }) {
  return (
    <div className={clsx(s.wrapper, open ? s.open : '', noOpacity ? s.noopacity : '')}>
      <LoaderIcon width={128} height={128} color="white" />
    </div>
  );
}

LoaderFull.defaultProps = {
  noOpacity: false,
};

export default LoaderFull;
