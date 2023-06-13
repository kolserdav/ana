import { IconProps } from '../../types';
import { ICON_WIDTH_DEFAULT, SCALE_ICONS_COEFF } from '../../utils/constants';

function Icon({ width, height, children, color, animate, className, withoutScale }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill={color}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: !withoutScale ? `scale(${SCALE_ICONS_COEFF})` : undefined,
      }}
    >
      <path d={children}>{animate}</path>
    </svg>
  );
}

Icon.defaultProps = {
  width: ICON_WIDTH_DEFAULT,
  height: ICON_WIDTH_DEFAULT,
  color: 'wheat',
  className: '',
};

export default Icon;
