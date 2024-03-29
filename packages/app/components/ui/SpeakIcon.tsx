import { Theme } from '../../Theme';
import { VolumeIcon } from '../../types';
import { DATA_TYPE_PLAY_BUTTON } from '../../utils/constants';
import VolumeHighIcon from '../icons/VolumeHigh';
import VolumeLowIcon from '../icons/VolumeLow';
import VolumeMediumIcon from '../icons/VolumeMedium';
import IconButton from './IconButton';

function SpeakIcon({
  onClick,
  theme,
  title,
  volumeIcon,
  titleHide,
}: {
  onClick: () => void;
  theme: Theme;
  title: string;
  volumeIcon: VolumeIcon;
  titleHide?: boolean;
}) {
  return (
    <IconButton
      theme={theme}
      titleHide={titleHide}
      datatype={DATA_TYPE_PLAY_BUTTON}
      onClick={onClick}
      title={title}
    >
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

SpeakIcon.defaultProps = {
  titleHide: undefined,
};

export default SpeakIcon;
