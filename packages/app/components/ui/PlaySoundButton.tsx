import { Theme } from '../../Theme';
import useSpeechSynth from '../../hooks/useSpeechSynth';
import SpeakIcon from './SpeakIcon';

function PlaySoundButton({
  text,
  voiceNotFound,
  lang,
  title,
  theme,
  onStop,
  titleHide,
}: {
  text: string;
  voiceNotFound: string;
  lang: string | undefined;
  title: string;
  theme: Theme;
  onStop?: () => void;
  titleHide?: boolean;
}) {
  const { speechText, synthAllow, volumeIcon } = useSpeechSynth({
    text,
    voiceNotFound,
    lang,
    onStop,
  });

  return synthAllow ? (
    <SpeakIcon
      titleHide={titleHide}
      onClick={speechText}
      title={title}
      volumeIcon={volumeIcon}
      theme={theme}
    />
  ) : null;
}

PlaySoundButton.defaultProps = {
  onStop: undefined,
  titleHide: undefined,
};

export default PlaySoundButton;
