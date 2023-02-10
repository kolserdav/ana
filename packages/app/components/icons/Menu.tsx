import { IconProps } from '../../types';
import Icon from './Icon';

function MenuIcon(props: Omit<IconProps, 'children'>) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Icon {...props}>M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z</Icon>;
}

export default MenuIcon;
