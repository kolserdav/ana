/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

function ChevronRightIcon(props: Omit<IconProps, 'children'>) {
  return <Icon {...props}>M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z</Icon>;
}

export default ChevronRightIcon;
