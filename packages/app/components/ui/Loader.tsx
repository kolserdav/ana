import clsx from 'clsx';
import s from './Loader.module.scss';
import LoaderIcon from '../icons/LoaderIcon';
import LoadIcon from '../icons/LoadIcon';
import { Theme } from '../../Theme';

function Loader({
  open,
  theme,
  noOpacity,
  iconHeight,
  iconWidth,
}: {
  open: boolean;
  theme: Theme;
  noOpacity?: boolean;
  iconWidth?: number;
  iconHeight?: number;
}) {
  return (
    <div
      style={{ backgroundColor: theme.active }}
      className={clsx(s.wrapper, open ? s.open : '', noOpacity ? s.noopacity : '')}
    >
      <LoadIcon width={iconWidth} height={iconHeight} color={theme.text} />
    </div>
  );
}

Loader.defaultProps = {
  noOpacity: false,
  iconHeight: 24,
  iconWidth: 24,
};

export default Loader;
