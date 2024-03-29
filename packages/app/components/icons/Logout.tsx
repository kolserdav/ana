/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function LogoutIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1
      14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z
    </Icon>
  );
}
