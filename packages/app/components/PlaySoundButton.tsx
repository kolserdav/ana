import { Theme } from '../Theme';
import useSpeechSynth from '../hooks/useSpeechSynth';
import SpeakIcon from './ui/SpeakIcon';

function PlaySoundButton({
  text,
  voiceNotFound,
  lang,
  title,
  theme,
}: {
  text: string;
  voiceNotFound: string;
  lang: string | undefined;
  title: string;
  theme: Theme;
}) {
  const { speechText, synthAllow, volumeIcon } = useSpeechSynth({
    text,
    voiceNotFound,
    lang,
  });

  return synthAllow ? (
    <SpeakIcon onClick={speechText} title={title} volumeIcon={volumeIcon} theme={theme} />
  ) : null;
}

export default PlaySoundButton;
