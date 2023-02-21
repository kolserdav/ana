/* eslint-disable react/jsx-props-no-spreading */
import { IconProps } from '../../types';
import Icon from './Icon';

export default function CloseIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z
    </Icon>
  );
}
