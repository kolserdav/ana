/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function ChartLineIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z
    </Icon>
  );
}
