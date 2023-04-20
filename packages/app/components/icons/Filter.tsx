/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function FilterIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z</Icon>;
}
