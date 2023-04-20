/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function SwapHorizontalIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z</Icon>;
}
