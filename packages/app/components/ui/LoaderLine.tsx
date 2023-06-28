import clsx from 'clsx';
import s from './LoaderLine.module.scss';

function LoaderLine({
  open,
  color,
  local,
  slow,
}: {
  open: boolean;
  color: string;
  local?: boolean;
  slow?: boolean;
}) {
  return (
    <div className={clsx(s.wrapper, local ? s.local : '')}>
      <div
        className={clsx(s.container, open ? s.open : '', slow ? s.slow : '')}
        style={open ? { backgroundColor: color } : undefined}
      />
    </div>
  );
}

LoaderLine.defaultProps = {
  local: undefined,
  slow: undefined,
};

export default LoaderLine;
