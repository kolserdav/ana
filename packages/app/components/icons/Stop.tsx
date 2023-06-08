/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function StopIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M18,18H6V6H18V18Z</Icon>;
}
