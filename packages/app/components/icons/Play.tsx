/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function PlayIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M8,5.14V19.14L19,12.14L8,5.14Z</Icon>;
}
