/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function VolumeLowIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M7,9V15H11L16,20V4L11,9H7Z</Icon>;
}
