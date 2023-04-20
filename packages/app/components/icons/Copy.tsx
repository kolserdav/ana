/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function CopyIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0
      19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z
    </Icon>
  );
}
