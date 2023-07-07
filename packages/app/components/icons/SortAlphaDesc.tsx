/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function SortAlphaDescIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      M19 7H22L18 3L14 7H17V21H19M11 13V15L7.67 19H11V21H5V19L8.33 15H5V13M9 3H7C5.9 3 5 3.9 5
      5V11H7V9H9V11H11V5C11 3.9 10.11 3 9 3M9 7H7V5H9Z
    </Icon>
  );
}
