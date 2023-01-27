import { ICON_WIDTH_DEFAULT } from '@/utils/constants';

function Icon({
  width,
  height,
  children,
  color,
}: {
  width?: number;
  height?: number;
  children: string;
  color?: string;
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={color}>
      <path d={children} />
    </svg>
  );
}

Icon.defaultProps = {
  width: ICON_WIDTH_DEFAULT,
  height: ICON_WIDTH_DEFAULT,
  color: 'wheat',
};

export default Icon;
