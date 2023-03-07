import clsx from 'clsx';
import { ubuntuItalic300 } from '../fonts/ubuntu';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';
import { isImage, Locale, MessageType, SendMessageArgs } from '../types/interfaces';
import { IMAGE_PREVIEW_WIDTH } from '../utils/constants';
import { getFilePath, getFormatDistance } from '../utils/lib';
import { getFileIconPath } from './CreateProject.lib';
import SendIcon from './icons/Send';
import { getProjectStatus } from './Me.lib';
import { useGiveProject, useTextArea } from './Project.hooks';
import s from './Project.module.scss';
import Hr from './ui/Hr';
import IconButton from './ui/IconButton';
import Image from './ui/Image';
import Textarea from './ui/Textarea';
import Typography from './ui/Typography';

function Project({
  project: _project,
  theme,
  user,
  projectStatus,
}: {
  project: SendMessageArgs<MessageType.SET_PROJECT_FIND_FIRST>['data'];
  theme: Theme;
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'];
  projectStatus: Locale['app']['projectStatus'];
}) {
  const { load } = useLoad();

  const { status, color } = getProjectStatus({ locale: projectStatus, theme, project: _project });

  const { project: __project } = useGiveProject({ project: _project, user });

  const project = __project || _project;

  const { inputText, rows, text } = useTextArea();

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
        <form>
          <Textarea theme={theme} onInput={inputText} value={text} rows={rows} />
          <div className={s.send__button}>
            <IconButton>
              <SendIcon color={theme.text} />
            </IconButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Project;
