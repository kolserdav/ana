import { IconProps } from '../../types';
import { ICON_WIDTH_DEFAULT } from '../../utils/constants';
import Icon from './Icon';

function LoaderIcon(props: Omit<IconProps, 'children'>) {
  const { width: _width, height: _height } = props;
  const width = (_width || ICON_WIDTH_DEFAULT) * 2;
  const height = (_height || ICON_WIDTH_DEFAULT) * 2;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Icon
      {...props}
      animate={
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${width / 4} ${height / 4}`}
          to={`360 ${width / 4} ${height / 4}`}
          dur="1600ms"
          repeatCount="indefinite"
        />
      }
    >
      M64.4 16a49 49 0 0 0-50 48 51 51 0 0 0 50 52.2 53 53 0 0 0 54-52c-.7-48-45-55.7-45-55.7s45.3
      3.8 49 55.6c.8 32-24.8 59.5-58 60.2-33 .8-61.4-25.7-62-60C1.3 29.8 28.8.6 64.3 0c0 0 8.5 0 8.7
      8.4 0 8-8.6 7.6-8.6 7.6z
    </Icon>
  );
}

export default LoaderIcon;
