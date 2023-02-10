import { IconProps } from '@/types';
import { ICON_WIDTH_DEFAULT } from '@/utils/constants';

function Icon({ width, height, children, color, animate }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={color}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <path d={children}>{animate}</path>
    </svg>
  );
}

Icon.defaultProps = {
  width: ICON_WIDTH_DEFAULT,
  height: ICON_WIDTH_DEFAULT,
  color: 'wheat',
};

export default Icon;
