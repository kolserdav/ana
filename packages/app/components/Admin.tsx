import { createRef } from 'react';
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
import DotsHorisontalIcon from './icons/DotsHorisontal';
import EditIcon from './icons/Edit';
import Tooltip from './ui/Tooltip';
import DeleteIcon from './icons/Delete';
import Link from './ui/Link';

function Admin({
  theme,
  title,
  locale,
  user,
  save,
  edit,
  _delete,
  cancel,
  openTools,
}: {
  locale: Locale['app']['admin'];
  theme: Theme;
  title: string;
  user: UserCleanResult | null;
  save: string;
  edit: string;
  _delete: string;
  cancel: string;
  openTools: string;
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
    pagePaths,
    onClickPushNotificationUpdateWraper,
    onClickPushNotificationDeleteWraper,
    deletePushNotificationDialog,
    deletePushNotification,
    setDeletePushNotificationDialog,
    onClickCloseDeletePushNotification,
    pushPriority,
    onChangePushPriority,
    pushNotificationToDelete,
    onClickChangePush,
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
          onClick={onClickOpenPushDialog}
        >
          <AddIcon color={theme.green} />
        </IconButton>
        <div className={s.pushs}>
          {pushs.map((item) => {
            const ref = createRef<HTMLButtonElement>();
            return (
              <div key={item.id} className={s.pushs__item} style={{ borderColor: theme.active }}>
                <div className={s.actions}>
                  <IconButton titleHide title={openTools} theme={theme} ref={ref}>
                    <DotsHorisontalIcon color={theme.text} />
                  </IconButton>

                  <Tooltip withoutClose closeOnClick theme={theme} parentRef={ref} length={50}>
                    <div className={p.menu_tooltip}>
                      <IconButton
                        viceVersa
                        theme={theme}
                        title={edit}
                        onClick={onClickPushNotificationUpdateWraper(item)}
                      >
                        <EditIcon color={theme.blue} />
                      </IconButton>
                      <IconButton
                        viceVersa
                        theme={theme}
                        title={_delete}
                        onClick={onClickPushNotificationDeleteWraper(item)}
                      >
                        <DeleteIcon color={theme.red} />
                      </IconButton>
                    </div>
                  </Tooltip>
                </div>
                <div className={s.data}>
                  <div className={s.cell}>
                    <b>{item.title}</b>
                  </div>
                  <div className={s.cell}>{item.description}</div>
                </div>
                <div className={s.meta}>
                  <div className={s.cell} style={{ fontSize: 'small' }}>
                    {item.priority}
                  </div>
                  <div className={s.cell} style={{ color: theme.cyan }}>
                    {item.lang}
                  </div>
                  <div className={s.cell} style={{ color: theme.blue }}>
                    <Link theme={theme} href={item.path}>
                      {item.path}
                    </Link>
                  </div>
                </div>
                <div className={s.date}>
                  <Typography
                    variant="span"
                    theme={theme}
                    small
                    styleName={item.updated === item.created ? 'info' : 'warn'}
                  >
                    {item.updated.toString()}
                  </Typography>
                </div>
              </div>
            );
          })}
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
            {pushPriority === null ? locale.createPushNotification : locale.editPushNotification}
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
              {pagePaths.map((item) => (
                <option key={item} value={Pages[item as keyof typeof Pages]}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          {pushPriority !== null && (
            <Input
              theme={theme}
              onChange={onChangePushPriority}
              value={pushPriority}
              id="push-notification-priority"
              type="number"
              required
              error={pushSubjectError}
              disabled={load || !user?.confirm}
              name={locale.pushPriority}
              fullWidth
            />
          )}
        </div>
        <div className={p.dialog__actions}>
          <Button className={s.button} onClick={onClickCancelPush} theme={theme}>
            {cancel}
          </Button>
          <div className={p.button_margin} />
          <Button
            disabled={load || !user?.confirm || pushText.length === 0 || pushSubjectError !== ''}
            className={s.button}
            onClick={pushPriority === null ? onClickPush : onClickChangePush}
            theme={theme}
          >
            {save}
          </Button>
        </div>
      </Dialog>
      <Dialog
        className={p.dialog}
        theme={theme}
        onClose={setDeletePushNotificationDialog}
        open={deletePushNotificationDialog}
      >
        <div className={p.dialog__content}>
          <Typography variant="h3" theme={theme} align="center">
            {`${locale.deletePushNotification}?`}
          </Typography>
          <Typography variant="h5" theme={theme}>
            {pushNotificationToDelete?.title}
          </Typography>
          <Typography variant="p" theme={theme}>
            {pushNotificationToDelete?.description}
          </Typography>
        </div>
        <div className={p.dialog__actions}>
          <Button className={s.button} onClick={onClickCloseDeletePushNotification} theme={theme}>
            {cancel}
          </Button>
          <div className={s.button_margin} />
          <Button className={s.button} onClick={deletePushNotification} theme={theme}>
            {_delete}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default Admin;
