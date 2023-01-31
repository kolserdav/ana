/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '@/types';
import Icon from './Icon';

function MenuOpenIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z
    </Icon>
  );
}

export default MenuOpenIcon;