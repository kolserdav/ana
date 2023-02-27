/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function PlusIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z</Icon>;
}
