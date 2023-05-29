import { Theme } from '../../Theme';
import { VolumeIcon } from '../../types';
import VolumeHighIcon from '../icons/VolumeHigh';
import VolumeLowIcon from '../icons/VolumeLow';
import VolumeMediumIcon from '../icons/VolumeMedium';
import IconButton from './IconButton';

function SpeakIcon({
  onClick,
  theme,
  title,
  volumeIcon,
}: {
  onClick: () => void;
  theme: Theme;
  title: string;
  volumeIcon: VolumeIcon;
}) {
  return (
    <IconButton onClick={onClick} title={title}>
      {volumeIcon === 'high' ? (
        <VolumeHighIcon color={theme.text} />
      ) : volumeIcon === 'medium' ? (
        <VolumeMediumIcon color={theme.text} />
      ) : (
        <VolumeLowIcon color={theme.text} />
      )}
    </IconButton>
  );
}

export default SpeakIcon;
