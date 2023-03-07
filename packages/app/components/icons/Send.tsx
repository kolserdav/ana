/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function SendIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M2,21L23,12L2,3V10L17,12L2,14V21Z</Icon>;
}
