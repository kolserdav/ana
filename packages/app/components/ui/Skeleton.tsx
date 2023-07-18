import s from './Skeleton.module.scss';

function Skeleton({ width, height }: { width: number; height: number }) {
  return (
    <div
      className={s.wrapper}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}

export default Skeleton;
