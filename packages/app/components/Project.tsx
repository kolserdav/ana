import clsx from 'clsx';
import { useMemo } from 'react';
import { ubuntu400, ubuntuBold400, ubuntuItalic300 } from '../fonts/ubuntu';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';
import { isImage, Locale, MessageType, SendMessageArgs } from '../types/interfaces';
import { IMAGE_PREVIEW_WIDTH } from '../utils/constants';
import { getFilePath, getFormatDistance } from '../utils/lib';
import { useInputFiles } from './CreateProject.hooks';
import { getAcceptedFiles, getFileIconPath } from './CreateProject.lib';
import AttachIcon from './icons/Attach';
import SendIcon from './icons/Send';
import { getProjectStatus } from './Me.lib';
import {
  useButtonMessages,
  useGiveProject,
  useProjectMessages,
  useTextArea,
} from './Project.hooks';
import s from './Project.module.scss';
import Hr from './ui/Hr';
import IconButton from './ui/IconButton';
import Image from './ui/Image';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Typography from './ui/Typography';

function Project({
  project: _project,
  theme,
  user,
  projectStatus,
  projectAddFiles,
  maxFileSize,
  somethingWentWrong,
}: {
  project: SendMessageArgs<MessageType.SET_PROJECT_FIND_FIRST>['data'];
  theme: Theme;
  somethingWentWrong: string;
  maxFileSize: string;
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'] | null;
  projectStatus: Locale['app']['projectStatus'];
  projectAddFiles: string;
}) {
  const isEmployer = user?.role === 'employer';

  const { load, setLoad } = useLoad();

  const { project: __project } = useGiveProject({ project: _project, user });

  const project = __project || _project;

  const { status, color } = getProjectStatus({ locale: projectStatus, theme, project });

  const { inputText, rows, text, setText } = useTextArea();

  const accept = useMemo(() => getAcceptedFiles(), []);

  const { onChangeFiles, onClickAddFiles, inputFilesRef, setFiles, files } = useInputFiles({
    load,
    maxFileSize,
    somethingWentWrong,
  });

  const { messages, addNewMessage } = useProjectMessages({
    project,
    user,
    files,
    setFiles,
    setLoad,
    inputFilesRef,
  });

  const { onClickPostMessageButton } = useButtonMessages({
    load,
    setLoad,
    setText,
    text,
    projectId: project.id,
    addNewMessage,
  });

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme}>
          {project.title}
        </Typography>
        <div className={s.status__container} style={{ color }}>
          {status}
        </div>
        <div className={s.status__container} style={{ color: theme.text }}>
          {getFormatDistance(new Date(project.updated))}
        </div>
        <Hr theme={theme} />
        <div
          style={{ color: theme.text }}
          className={s.desc}
          dangerouslySetInnerHTML={{ __html: project.description }}
        />
        <div className={s.files}>
          {project.File.map((item) => (
            <div className={s.item} key={item.id}>
              <Image
                link={!isImage(item.mimetype) ? getFilePath(item) : undefined}
                className="files__image"
                width={item.width || 0}
                height={item.height || 0}
                preWidth={IMAGE_PREVIEW_WIDTH / 2}
                preHeight={IMAGE_PREVIEW_WIDTH / 2 / (item.coeff || 1)}
                src={isImage(item.mimetype) ? getFilePath(item) : getFileIconPath(item)}
                alt={item.filename}
              />

              <div
                style={{ color: theme.text }}
                className={clsx(s.file__name, ubuntuItalic300.className)}
              >
                {item.filename}
              </div>
            </div>
          ))}
        </div>
        <Hr theme={theme} />
        {messages.items.map((item) => (
          <div
            style={{ color: theme.text }}
            key={item.id}
            className={clsx(s.message, item.userId === user?.id ? s.me : '')}
          >
            <div className={clsx(s.name, ubuntuBold400.className)}>
              {item.userId !== user?.id
                ? isEmployer
                  ? project.Worker?.name
                  : project.Employer?.name
                : undefined}
            </div>
            <div className={clsx(s.date, ubuntuItalic300.className)}>
              {getFormatDistance(new Date(item.created))}
            </div>
            <div className={clsx(s.content, ubuntu400.className)}>{item.content}</div>
            {item.File && (
              <Image
                link={!isImage(item.File.mimetype) ? getFilePath(item.File) : undefined}
                className="files__image"
                width={item.File.width || 0}
                height={item.File.height || 0}
                preWidth={IMAGE_PREVIEW_WIDTH / 2}
                preHeight={IMAGE_PREVIEW_WIDTH / 2 / (item.File.coeff || 1)}
                src={
                  isImage(item.File.mimetype) ? getFilePath(item.File) : getFileIconPath(item.File)
                }
                alt={item.File.filename}
              />
            )}
          </div>
        ))}
        <form>
          <Input
            ref={inputFilesRef}
            type="file"
            id="project-file"
            value=""
            hidden
            accept={accept}
            multiple
            onChange={onChangeFiles}
            name={projectAddFiles}
            theme={theme}
          />
          <Textarea disabled={load} theme={theme} onInput={inputText} value={text} rows={rows} />
          <div className={s.attach_icon}>
            <IconButton onClick={onClickAddFiles}>
              <AttachIcon color={theme.text} />
            </IconButton>
          </div>
          <div className={s.send__button}>
            <IconButton onClick={onClickPostMessageButton} disabled={load}>
              <SendIcon color={theme.text} />
            </IconButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Project;
