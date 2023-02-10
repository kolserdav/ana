/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

function ChevronUpIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z</Icon>;
}

export default ChevronUpIcon;
