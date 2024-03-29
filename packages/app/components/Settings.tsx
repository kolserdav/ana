import { useRef } from 'react';
import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import useSpeechSynth from '../hooks/useSpeechSynth';
import { Locale, UserCleanResult } from '../types/interfaces';
import { SPEECH_SPEED_MAX, URL_PLACEHOLDER } from '../utils/constants';
import { useEmailInput, useNameInput, usePasswordInput } from './Login.hooks';
import {
  useChangeNode,
  useClean,
  useConfirmEmail,
  useDeleteAccount,
  useLanguage,
  useListenFocus,
  useNotStopWeb,
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
import IconButton from './ui/IconButton';
import EmailCheckIcon from './icons/EmailCheck';
import EmailAlertIcon from './icons/EmailAlert';
import Radio from './ui/Radio';
import Switch from './ui/Switch';
import Tooltip from './ui/Tooltip';
import DotsHorisontalIcon from './icons/DotsHorisontal';
import VolumeOffIcon from './icons/VolumeOff';

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
  sendMail,
  emailIsSend,
  url,
  urlDefault,
  wrongUrlFormat,
  isAndroid,
  openTools,
  notificationEnabled,
  setNotificationEnabled,
  needUpdateApp,
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
  sendMail: string;
  emailIsSend: string;
  url: string | null;
  urlDefault: string;
  wrongUrlFormat: string;
  isAndroid: boolean;
  openTools: string;
  notificationEnabled: boolean;
  // eslint-disable-next-line no-unused-vars
  setNotificationEnabled: (value: boolean) => void;
  needUpdateApp: string;
}) {
  const settingsSetSaveRef = useRef(null);

  const { load, setLoad } = useLoad();
  const { lang, langs, changeLang } = useLanguage();

  useListenFocus();

  const {
    testText,
    onChangeTestText,
    onChangeSaveVoiceTestText,
    saveVoiceTestText,
    onChangeSaveAllTestText,
    saveAllTestText,
  } = useTestSpeech({ lang });

  const {
    synthAllow,
    speechText,
    speechSpeed,
    changeSpeechSpeed,
    volumeIcon,
    voices,
    changeVoice,
    voice,
  } = useSpeechSynth({
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

  const {
    sendConfirmEmail,
    setSendConfirmEmail,
    onClickCloseConfirmEmail,
    onClickConfirmEmail,
    onClickOpenConfirmEmail,
  } = useConfirmEmail({ user, setLoad, emailIsSend });

  const {
    onChangeRadioWrapper,
    onChangeNewNode,
    isDefaultNode,
    isNode,
    node,
    nodeError,
    nodeSuccess,
    oldSuccessCustomNode,
    onClickOldSuccessCustomNode,
  } = useChangeNode({
    url,
    urlDefault,
    wrongUrlFormat,
    serverIsNotRespond: locale.serverIsNotRespond,
    successCheckNode: locale.successCheckNode,
    needUpdateApp,
  });

  const { setNotStopWeb, notStopWeb } = useNotStopWeb({ needUpdateApp });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme}>
          {locale.title}
        </Typography>
        {(isAndroid || user?.role === 'admin') && (
          <>
            <Hr theme={theme} />
            <Typography variant="h4" theme={theme}>
              {locale.selectNode}
            </Typography>
            <div className={s.settings__item}>
              <div className={s.select_node} style={{ borderColor: theme.text }}>
                <div className={s.select_node__item}>
                  <Typography variant="h5" theme={theme} disabled={!isDefaultNode}>
                    {locale.defaultNode}
                  </Typography>
                  <Typography variant="p" theme={theme} disabled={!isDefaultNode}>
                    {urlDefault}
                  </Typography>
                </div>
                <Radio checked={isDefaultNode} onChange={onChangeRadioWrapper('urlDefault')} />
              </div>
              <div className={s.select_node}>
                <div className={s.select_node__item}>
                  <Typography variant="h5" theme={theme} disabled={isDefaultNode}>
                    {locale.customNode}
                  </Typography>
                  <Input
                    type="text"
                    id={s.select_node}
                    theme={theme}
                    error={nodeError}
                    value={node}
                    success={nodeSuccess}
                    name={URL_PLACEHOLDER}
                    onChange={onChangeNewNode}
                    disabled={!isNode}
                    dropdown={
                      oldSuccessCustomNode
                        ? [{ text: oldSuccessCustomNode, onClick: onClickOldSuccessCustomNode }]
                        : undefined
                    }
                  />
                </div>
                <Radio checked={isNode} onChange={onChangeRadioWrapper('url')} />
              </div>
            </div>
          </>
        )}

        {((isAndroid && user) || user?.role === 'admin') && (
          <>
            <Hr theme={theme} />
            <Typography variant="h4" theme={theme}>
              {locale.notifications.title}
            </Typography>
            <div className={s.switch__item}>
              <Typography variant="label" small theme={theme}>
                {locale.notifications.label}
              </Typography>
              <Typography variant="span" small blur theme={theme}>
                {locale.notifications.description}
              </Typography>
              <div className={s.switch__item__button}>
                <Switch onClick={setNotificationEnabled} theme={theme} on={notificationEnabled} />
              </div>
            </div>
          </>
        )}

        <Hr theme={theme} />
        <Typography variant="h4" theme={theme}>
          {locale.powerSettings.title}
        </Typography>
        <div className={s.switch__item}>
          <Typography variant="label" small theme={theme}>
            {locale.powerSettings.label}
          </Typography>
          <Typography variant="span" small blur theme={theme}>
            {locale.powerSettings.description}
          </Typography>
          <div className={s.switch__item__button}>
            <Switch onClick={setNotStopWeb} theme={theme} on={notStopWeb || false} />
          </div>
        </div>

        <Hr theme={theme} />
        <Typography variant="h4" theme={theme}>
          {locale.speechSettings}
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
            {voices.length !== 0 && (
              <div className={s.lang_select__voice}>
                <Select
                  onChange={changeVoice}
                  value={voice}
                  aria-label={locale.speechVoice}
                  theme={theme}
                >
                  {voices.map((item) => (
                    <option key={item.lang} value={item.lang}>
                      {item.value}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>
          <div className={s.test_input__item} style={{ borderColor: theme.text }}>
            <Input
              type="text"
              id="test-speech"
              theme={theme}
              value={testText}
              name={locale.speechTest}
              onChange={onChangeTestText}
              disabled={load}
            />
            <IconButton title={openTools} titleHide theme={theme} ref={settingsSetSaveRef}>
              <DotsHorisontalIcon color={theme.text} />
            </IconButton>
            <div className={s.speech_button}>
              {synthAllow ? (
                <SpeakIcon
                  onClick={speechText}
                  title={playSound}
                  volumeIcon={volumeIcon}
                  theme={theme}
                />
              ) : (
                <IconButton theme={theme} disabled title={voiceNotFound}>
                  <VolumeOffIcon color={theme.text} />
                </IconButton>
              )}
            </div>
            <Tooltip parentRef={settingsSetSaveRef} theme={theme} length={140} withoutClose>
              <div className={s.save_test_text_container}>
                <div className={p.icon}>
                  <IconButton
                    viceVersa
                    title={locale.saveAllTestText}
                    theme={theme}
                    onClick={onChangeSaveAllTestText}
                  >
                    <Switch
                      viceVersa
                      on={saveAllTestText}
                      onClick={onChangeSaveAllTestText}
                      theme={theme}
                    />
                  </IconButton>
                </div>
                <div className={p.icon}>
                  <IconButton
                    viceVersa
                    onClick={onChangeSaveVoiceTestText}
                    title={locale.saveVoiceTestText}
                    theme={theme}
                  >
                    <Switch
                      onClick={onChangeSaveVoiceTestText}
                      viceVersa
                      on={saveVoiceTestText}
                      theme={theme}
                    />
                  </IconButton>
                </div>
              </div>
            </Tooltip>
          </div>
          <div className={s.speed_select} style={{ borderColor: theme.active }}>
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
        </div>
        {user !== null && (
          <>
            <Hr theme={theme} />
            <Typography variant="h4" theme={theme}>
              {locale.personalData}
            </Typography>
          </>
        )}
        {user !== null && (
          <div className={s.personal_data}>
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
            />
            <div className={s.email_input}>
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
              <div className={s.email_input__icon}>
                <IconButton
                  theme={theme}
                  title={user.confirm ? locale.emailIsConfirmed : locale.sendConfirmEmail}
                  onClick={user?.confirm ? undefined : onClickOpenConfirmEmail}
                >
                  {user.confirm ? (
                    <EmailCheckIcon className={s.opacity} color={theme.green} />
                  ) : (
                    <EmailAlertIcon className={s.opacity} color={theme.red} />
                  )}
                </IconButton>
              </div>
            </div>
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
        <Hr theme={theme} />
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
      <Dialog
        className={p.dialog}
        theme={theme}
        onClose={setSendConfirmEmail}
        open={sendConfirmEmail}
      >
        <div className={p.dialog__content}>
          <Typography variant="h3" theme={theme} align="center">
            {`${locale.sendConfirmEmail}?`}
          </Typography>
          <Typography variant="p" theme={theme}>
            {user?.email}
          </Typography>
        </div>
        <div className={p.dialog__actions}>
          <Button
            className={s.button}
            disabled={load}
            onClick={onClickCloseConfirmEmail}
            theme={theme}
          >
            {cancel}
          </Button>
          <Button disabled={load} className={s.button} onClick={onClickConfirmEmail} theme={theme}>
            {sendMail}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default Settings;
