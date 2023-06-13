import { Theme } from '../Theme';
import useSpeechSynth from '../hooks/useSpeechSynth';
import SpeakIcon from './ui/SpeakIcon';

function PlaySoundButton({
  text,
  voiceNotFound,
  lang,
  title,
  theme,
  onStop,
  changeLinkTo,
}: {
  text: string;
  voiceNotFound: string;
  lang: string | undefined;
  title: string;
  theme: Theme;
  onStop?: () => void;
  changeLinkTo?: string;
}) {
  const { speechText, synthAllow, volumeIcon } = useSpeechSynth({
    text,
    voiceNotFound,
    lang,
    onStop,
    changeLinkTo,
  });

  return synthAllow ? (
    <SpeakIcon onClick={speechText} title={title} volumeIcon={volumeIcon} theme={theme} />
  ) : null;
}

PlaySoundButton.defaultProps = {
  onStop: undefined,
  changeLinkTo: undefined,
};

export default PlaySoundButton;
