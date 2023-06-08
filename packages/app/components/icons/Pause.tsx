/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function PauseIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M14,19H18V5H14M6,19H10V5H6V19Z</Icon>;
}
