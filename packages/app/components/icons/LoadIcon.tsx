import { IconProps } from '../../types';
import { ICON_WIDTH_DEFAULT } from '../../utils/constants';
import Icon from './Icon';

function LoadIcon(props: Omit<IconProps, 'children'>) {
  const { width: _width, height: _height } = props;
  const width = (_width || ICON_WIDTH_DEFAULT) / 2;
  const height = (_height || ICON_WIDTH_DEFAULT) / 2;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Icon
      {...props}
      animate={
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${width} ${height}`}
          to={`360 ${width} ${height}`}
          dur="1600ms"
          repeatCount="indefinite"
        />
      }
    >
      M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z
    </Icon>
  );
}

export default LoadIcon;
