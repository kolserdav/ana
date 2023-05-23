import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, UserCleanResult } from '../types/interfaces';
import { useTestSpeech } from './Settings.hooks';
import s from './Settings.module.scss';
import VolumeHighIcon from './icons/VolumeHigh';
import IconButton from './ui/IconButton';
import Input from './ui/Input';
import Typography from './ui/Typography';

function Settings({
  locale,
  theme,
  user,
}: {
  locale: Locale['app']['settings'];
  theme: Theme;
  user: UserCleanResult | null;
}) {
  const { load } = useLoad();
  const { testText, onChangeTestText } = useTestSpeech();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme}>
          {locale.title}
        </Typography>
        <div className={s.test_input}>
          <Input
            type="text"
            id="test-speech"
            theme={theme}
            value={testText}
            name={locale.speechTest}
            onChange={onChangeTestText}
            disabled={load}
          />
          <div className={s.speech_button}>
            <IconButton>
              <VolumeHighIcon color={theme.text} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
