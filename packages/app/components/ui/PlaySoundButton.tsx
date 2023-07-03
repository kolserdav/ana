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
  changeLinkTo,
  titleHide,
}: {
  text: string;
  voiceNotFound: string;
  lang: string | undefined;
  title: string;
  theme: Theme;
  onStop?: () => void;
  changeLinkTo?: string;
  titleHide?: boolean;
}) {
  const { speechText, synthAllow, volumeIcon } = useSpeechSynth({
    text,
    voiceNotFound,
    lang,
    onStop,
    changeLinkTo,
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
  changeLinkTo: undefined,
  titleHide: undefined,
};

export default PlaySoundButton;
