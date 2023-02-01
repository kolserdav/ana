import { IconProps } from '@/types';
import Icon from './Icon';

function WarnIcon(props: Omit<IconProps, 'children'>) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Icon {...props}>M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16</Icon>;
}

export default WarnIcon;
