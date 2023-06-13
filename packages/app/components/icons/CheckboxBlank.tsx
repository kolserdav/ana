/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function CheckboxBlankIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3
      19,3M19,5V19H5V5H19Z
    </Icon>
  );
}
