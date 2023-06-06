import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import useSpeechSynth from '../hooks/useSpeechSynth';
import { Locale, UserCleanResult } from '../types/interfaces';
import { SPEECH_SPEED_MAX } from '../utils/constants';
import { useEmailInput, useNameInput, usePasswordInput } from './Login.hooks';
import {
  useClean,
  useDeleteAccount,
  useLanguage,
  usePersonalData,
  useTestSpeech,
} from './Settings.hooks';
import s from './Settings.module.scss';
import p from '../styles/Page.module.scss';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Hr from './ui/Hr';
import Input from './ui/Input';
import Select from './ui/Select';
import Typography from './ui/Typography';
import SpeakIcon from './ui/SpeakIcon';
import Checkbox from './ui/Checkbox';
import Spoiler from './ui/Spoiler';

function Settings({
  locale,
  theme,
  user,
  voiceNotFound,
  playSound,
  localeLogin,
  fieldMustBeNotEmpty,
  eliminateRemarks,
  cancel,
  _delete,
}: {
  locale: Locale['app']['settings'];
  localeLogin: Locale['app']['login'];
  theme: Theme;
  user: UserCleanResult | null;
  voiceNotFound: string;
  playSound: string;
  fieldMustBeNotEmpty: string;
  eliminateRemarks: string;
  cancel: string;
  _delete: string;
}) {
  const { load, setLoad } = useLoad();
  const { testText, onChangeTestText } = useTestSpeech();

  const { lang, langs, changeLang } = useLanguage();

  const { synthAllow, speechText, speechSpeed, changeSpeechSpeed, volumeIcon } = useSpeechSynth({
    text: testText,
    voiceNotFound,
    lang,
  });

  const { name, nameError, onChangeName, onBlurName, setNameError, setName } = useNameInput({
    locale: localeLogin,
  });

  const {
    email,
    emailError,
    emailSuccess,
    onChangeEmail,
    onBlurEmail,
    setEmailError,
    setEmail,
    setEmailSuccess,
  } = useEmailInput({
    locale: localeLogin,
    isSignUp: true,
    user,
  });

  const {
    password: oldPassword,
    passwordError: oldPasswordError,
    passwordSuccess: oldPasswordSuccess,
    onChangePassword: onChangeOldPassword,
    setPasswordError: setOldPasswordError,
    onBlurPassword: onBlurOldPassword,
    setPasswordSuccess: setOldPasswordSuccess,
    setPassword: setOldPassword,
  } = usePasswordInput({
    locale: localeLogin,
    isSignUp: false,
    fieldMustBeNotEmpty,
  });

  const {
    password,
    passwordError,
    passwordSuccess,
    setPassword,
    setPasswordRepeat,
    onChangePassword,
    onBlurPassword,
    onChangePasswordRepeat,
    onBlurPasswordRepeat,
    passwordRepeat,
    passwordRepeatError,
    passwordRepeatSuccess,
    setPasswordError,
    setPasswordRepeatError,
    setPasswordRepeatSuccess,
    setPasswordSuccess,
  } = usePasswordInput({
    locale: localeLogin,
    isSignUp: true,
    fieldMustBeNotEmpty,
  });

  const {
    buttonError,
    onClickSaveButton,
    setButtonError,
    needClean,
    changePassword,
    setChangePassword,
    changePasswordHeight,
  } = usePersonalData({
    setEmail,
    setName,
    user,
    setEmailError,
    setLoad,
    setPasswordError,
    email,
    emailError,
    password,
    passwordError,
    passwordRepeatError,
    fieldMustBeNotEmpty,
    eliminateRemarks,
    oldPassword,
    setOldPasswordError,
    oldPasswordError,
    name,
    localeLogin,
    passwordsDoNotMatch: localeLogin.passwordsDoNotMatch,
    setPasswordRepeatError,
    passwordRepeat,
  });

  useClean({
    setButtonError,
    setEmailError,
    setEmailSuccess,
    setPassword,
    setNameError,
    setOldPassword,
    setOldPasswordError,
    setOldPasswordSuccess,
    setPasswordError,
    setPasswordRepeat,
    setPasswordRepeatError,
    setPasswordRepeatSuccess,
    setPasswordSuccess,
    needClean,
  });

  const {
    onClickDeleteAccount,
    onClickCloseDelete,
    onClickOpenDeleteAccount,
    deleteAccount,
    setDeleteAccount,
    onKeyDownDeleteAccount,
    deleteSecure,
    onChangeDeleteSecure,
    canDeleteAccount,
    acceptDeleteWarning,
    setAcceptDeleteWarning,
  } = useDeleteAccount({ user, setLoad, locale });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme}>
          {locale.title}
        </Typography>
        <Hr theme={theme} />
        <Typography variant="h4" theme={theme}>
          {locale.speechSpeed}
        </Typography>
        <div className={s.test_input}>
          <div className={s.lang_select}>
            <Select onChange={changeLang} value={lang} aria-label={locale.speechLang} theme={theme}>
              {langs.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          {!synthAllow && (
            <div className={s.test_input__item}>
              <Typography blur variant="p" theme={theme}>
                {voiceNotFound}
              </Typography>
            </div>
          )}
          {synthAllow && (
            <div className={s.test_input__item}>
              <Input
                type="text"
                id="test-speech"
                theme={theme}
                value={testText}
                name={locale.speechTest}
                onChange={onChangeTestText}
                disabled={load}
              />
            </div>
          )}
          {synthAllow && (
            <div className={s.speed_select}>
              <Typography variant="label" theme={theme}>
                {`${locale.speechSpeed}: ${speechSpeed}`}
              </Typography>
              <input
                type="range"
                value={speechSpeed}
                max={SPEECH_SPEED_MAX}
                min={0}
                step={0.1}
                name="tes"
                onChange={changeSpeechSpeed}
                id="speech-speed"
              />
            </div>
          )}
          {synthAllow && (
            <div className={s.speech_button}>
              <SpeakIcon
                onClick={speechText}
                title={playSound}
                volumeIcon={volumeIcon}
                theme={theme}
              />
            </div>
          )}
        </div>
        {user !== null && (
          <div className={s.personal_data}>
            <Hr theme={theme} />
            <Typography variant="h4" theme={theme}>
              {locale.personalData}
            </Typography>
            <Input
              theme={theme}
              onChange={onChangeName}
              onBlur={onBlurName}
              value={name}
              id="name"
              type="text"
              required
              error={nameError}
              disabled={load}
              name={localeLogin.name}
              fullWidth
            />
            <Input
              theme={theme}
              onChange={onChangeEmail}
              onBlur={onBlurEmail}
              value={email}
              id="email"
              type="email"
              required
              error={emailError}
              success={emailSuccess}
              disabled={load}
              name={localeLogin.email}
              fullWidth
            />
            <Spoiler
              height={changePasswordHeight}
              theme={theme}
              open={changePassword}
              summary={locale.changePassword}
              setOpen={setChangePassword}
              className={s.change_password_spoiler}
            >
              <>
                <Input
                  theme={theme}
                  onChange={onChangeOldPassword}
                  onBlur={onBlurOldPassword}
                  value={oldPassword}
                  id="old-password"
                  type="password"
                  required
                  colorActive
                  error={oldPasswordError}
                  success={oldPasswordSuccess}
                  disabled={load}
                  name={localeLogin.password}
                  fullWidth
                />
                <Input
                  theme={theme}
                  onChange={onChangePassword}
                  onBlur={onBlurPassword}
                  value={password}
                  id="password"
                  type="password"
                  required
                  colorActive
                  error={passwordError}
                  success={passwordSuccess}
                  disabled={load}
                  name={localeLogin.newPassword}
                  fullWidth
                />
                <Input
                  theme={theme}
                  onChange={onChangePasswordRepeat}
                  onBlur={onBlurPasswordRepeat}
                  value={passwordRepeat}
                  id="password-repeat"
                  type="password"
                  required
                  colorActive
                  error={passwordRepeatError}
                  success={passwordRepeatSuccess}
                  disabled={load}
                  name={localeLogin.passwordRepeat}
                  fullWidth
                />
              </>
            </Spoiler>
            <Button
              classNameWrapper={s.button}
              error={buttonError}
              disabled={load}
              theme={theme}
              onClick={onClickSaveButton}
            >
              {localeLogin.save}
            </Button>
            <span
              role="button"
              tabIndex={-1}
              onKeyDown={onKeyDownDeleteAccount}
              onClick={onClickOpenDeleteAccount}
              className={s.delete_button}
              style={{ color: theme.red }}
            >
              {locale.deleteAccountTitle}
            </span>
          </div>
        )}
      </div>
      <Dialog className={p.dialog} theme={theme} onClose={setDeleteAccount} open={deleteAccount}>
        <Typography variant="h3" theme={theme} align="center">
          {`${locale.deleteAccountTitle}?`}
        </Typography>
        <Typography variant="p" theme={theme}>
          {locale.deleteAccountDesc}
        </Typography>
        <Typography variant="p" theme={theme}>
          {`<b>${locale.deleteAccountSecure}:</b> <span style="color:${theme.yellow};">${locale.deleteMyAccount}</span>`}
        </Typography>
        <Input
          type="text"
          value={deleteSecure}
          name={locale.deleteVerifying}
          onChange={onChangeDeleteSecure}
          theme={theme}
          id="delete-secure"
        />
        <Checkbox
          label={locale.deleteAccountWarning}
          onChange={setAcceptDeleteWarning}
          checked={acceptDeleteWarning}
          theme={theme}
          className={s.warning_delete}
          id="accept-delete-warning"
        />
        <div className={p.dialog__actions}>
          <Button className={s.button} disabled={load} onClick={onClickCloseDelete} theme={theme}>
            {cancel}
          </Button>
          <Button
            disabled={load || !canDeleteAccount || !acceptDeleteWarning}
            className={s.button}
            onClick={onClickDeleteAccount}
            theme={theme}
          >
            {_delete}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default Settings;
