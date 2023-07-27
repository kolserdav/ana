import { Theme } from '../Theme';
import useLoad from '../hooks/useLoad';
import { Locale, UserCleanResult } from '../types/interfaces';
import { useCreatePushNotification, usePushNotifications } from './Admin.hooks';
import s from './Admin.module.scss';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import Hr from './ui/Hr';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Typography from './ui/Typography';
import p from '../styles/Page.module.scss';
import {
  LOCALE_NAMES,
  PUSH_NOTIFICATION_DESCRIPTION_MAX_LENGTH,
  PUSH_NOTIFICATION_TITLE_MAX_LENGTH,
  Pages,
} from '../utils/constants';
import IconButton from './ui/IconButton';
import AddIcon from './icons/Add';
import Select from './ui/Select';

function Admin({
  theme,
  title,
  locale,
  user,
  save,
  edit,
  _delete,
  cancel,
}: {
  locale: Locale['app']['admin'];
  theme: Theme;
  title: string;
  user: UserCleanResult | null;
  save: string;
  edit: string;
  _delete: string;
  cancel: string;
}) {
  const { setLoad, load } = useLoad();

  const { pushs, pages, page, onClickPushPaginationWrapper, pushRestart } = usePushNotifications({
    setLoad,
  });

  const {
    onClickPush,
    pushDialog,
    setPushDialog,
    onChangePushSubject,
    onBlurPushSubject,
    pushSubject,
    pushSubjectError,
    changePushText,
    onClickCancelPush,
    pushText,
    pushTextRows,
    pushTextError,
    onClickOpenPushDialog,
    onChangePushLang,
    onChangePushPath,
    pushLang,
    pushPath,
  } = useCreatePushNotification({ user, setLoad, locale, pushRestart });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme} fullWidth align="center">
          {title}
        </Typography>
        <Hr theme={theme} />
        <Typography variant="h3" theme={theme}>
          {locale.pushNotifications}
        </Typography>
        <IconButton
          theme={theme}
          title={locale.createPushNotification}
          titleHide
          onClick={onClickOpenPushDialog}
        >
          <AddIcon color={theme.green} />
        </IconButton>
        <div className={s.pushs}>
          {pushs.map((item) => (
            <div key={item.id} className={s.pushs__item} style={{ borderColor: theme.active }}>
              <div className={s.data}>
                <div className={s.cell}>
                  <b>{item.title}</b>
                </div>
                <div className={s.cell}>{item.description}</div>
              </div>
              <div className={s.meta}>
                <div className={s.cell} style={{ color: theme.green }}>
                  {item.lang}
                </div>
                <div className={s.cell} style={{ color: theme.blue }}>
                  {item.path}
                </div>
              </div>
            </div>
          ))}
          <div className={s.pagination}>
            {pages.map((item, index, array) => (
              <div
                role="button"
                tabIndex={-1}
                onKeyDown={() => {
                  // TODO
                }}
                className={s.pagination__item}
                key={item}
                onClick={onClickPushPaginationWrapper(item)}
                style={{
                  color: item === page ? theme.text : theme.blue,
                  cursor: item === page ? 'default' : 'pointer',
                }}
              >
                {item}
                {array[index + 1] !== undefined ? '...' : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dialog
        withoutCloseAlways
        className={p.dialog}
        theme={theme}
        onClose={setPushDialog}
        open={pushDialog}
      >
        <div className={p.dialog__content}>
          <Typography variant="h3" theme={theme} align="center">
            {locale.createPushNotification}
          </Typography>
          <Input
            theme={theme}
            onChange={onChangePushSubject}
            onBlur={onBlurPushSubject}
            value={pushSubject}
            id="push-notification"
            type="text"
            required
            error={pushSubjectError}
            disabled={load || !user?.confirm}
            name={locale.pushTitle}
            fullWidth
            maxLength={PUSH_NOTIFICATION_TITLE_MAX_LENGTH}
            desc={`${pushSubject.length}/${PUSH_NOTIFICATION_TITLE_MAX_LENGTH}`}
          />
          <Textarea
            placeholder={locale.pushBody}
            value={pushText}
            spellCheck
            onInput={changePushText}
            rows={pushTextRows}
            theme={theme}
            disabled={load || !user?.confirm}
            maxLength={PUSH_NOTIFICATION_DESCRIPTION_MAX_LENGTH}
            error={pushTextError}
          />
          <div className={s.dialog__select}>
            <Select
              value={pushLang}
              onChange={onChangePushLang}
              aria-label={locale.pushLanguage}
              theme={theme}
            >
              {Object.keys(LOCALE_NAMES).map((item) => (
                <option key={item} value={item}>
                  {LOCALE_NAMES[item as keyof typeof LOCALE_NAMES]}
                </option>
              ))}
            </Select>
          </div>
          <div className={s.dialog__select}>
            <Select
              value={pushPath}
              onChange={onChangePushPath}
              aria-label={locale.pushPath}
              theme={theme}
            >
              {Object.keys(Pages).map((item) => (
                <option key={item} value={item}>
                  {Pages[item as keyof typeof Pages]}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className={p.dialog__actions}>
          <Button className={s.button} onClick={onClickCancelPush} theme={theme}>
            {cancel}
          </Button>
          <div className={p.button_margin} />
          <Button
            disabled={load || !user?.confirm || pushText.length === 0 || pushSubjectError !== ''}
            className={s.button}
            onClick={onClickPush}
            theme={theme}
          >
            {save}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default Admin;
