import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useMemo, useRef } from 'react';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';
import { isImage, Locale } from '../types/interfaces';
import {
  IMAGE_PREVIEW_WIDTH,
  MAX_DATE_ACTUAL,
  MIN_DATE_ACTUAL,
  PROJECT_TITLE_MAX,
} from '../utils/constants';
import { getFilePath } from '../utils/lib';
import {
  useBeforeUnload,
  useDescriptionInput,
  useEndDateInput,
  useInputFiles,
  useTitleInput,
} from './CreateProject.hooks';
import { getAcceptedFiles, getColor, getFileIconPath } from './CreateProject.lib';
import s from './CreateProject.module.scss';
import DeleteIcon from './icons/Delete';
import HelpIcon from './icons/Help';
import Button from './ui/Button';
import IconButton from './ui/IconButton';
import Image from './ui/Image';
import Input from './ui/Input';
import Tooltip from './ui/Tooltip';
import Typography from './ui/Typography';

const HtmlEditor = dynamic(() => import('./ui/HtmlEditor'));

function CreateProject({
  theme,
  locale,
  formDesc,
  touchpad,
  showHelp,
}: {
  theme: Theme;
  locale: Locale['app']['me'];
  formDesc: string;
  touchpad: boolean;
  showHelp: string;
}) {
  const filesRef = useRef<HTMLDivElement>(null);

  const helpDateRef = useRef<HTMLButtonElement>(null);

  const { load, setLoad } = useLoad();

  const { description, onChangeDescription } = useDescriptionInput();

  const { onChangeTitle, title } = useTitleInput();

  const { endDate, onChangeEndDate } = useEndDateInput();

  const {
    onChangeFiles,
    files,
    onDropFiles,
    onDragOverFiles,
    onDragLeave,
    filesActive,
    inputFilesRef,
    onClickAddFiles,
    deleteFileWrapper,
  } = useInputFiles({ setLoad, load });

  useBeforeUnload({ files, title, description, endDate });

  const accept = useMemo(() => getAcceptedFiles(), []);

  return (
    <div className={s.wrapper}>
      <form className={s.container}>
        <Typography theme={theme} variant="h1">
          {locale.createProject}
        </Typography>
        <Typography theme={theme} variant="p">
          {formDesc}
        </Typography>
        <Input
          type="text"
          fullWidth
          id="project-title"
          value={title}
          onChange={onChangeTitle}
          name={`${locale.projectTitle}*`}
          desc={`${title.length}/${PROJECT_TITLE_MAX}`}
          theme={theme}
        />
        <div className={s.html__editor}>
          <HtmlEditor
            value={description}
            placeholder={locale.projectDesPlaceholder}
            id="description"
            label={`${locale.projectDescription}*`}
            onChange={onChangeDescription}
            theme={theme}
          />
        </div>
        <div className={s.date}>
          <Input
            theme={theme}
            id="actual-for"
            type="date"
            min={MIN_DATE_ACTUAL}
            max={MAX_DATE_ACTUAL}
            name={`${locale.projectActualFor}*`}
            value={endDate}
            onChange={onChangeEndDate}
          />
          <IconButton ref={helpDateRef} title={showHelp}>
            <HelpIcon color={theme.blue} />
          </IconButton>
          <Tooltip current={helpDateRef.current} theme={theme}>
            {locale.projectDateTooltip}
          </Tooltip>
        </div>
        <div className={s.files_container} style={{ backgroundColor: theme.active }}>
          {!filesActive && (
            <div className={s.button__files}>
              <Button theme={theme} disabled={load} onClick={onClickAddFiles}>
                {locale.projectAddFiles}
              </Button>
            </div>
          )}
          <Input
            ref={inputFilesRef}
            type="file"
            id="project-file"
            value=""
            hidden
            accept={accept}
            multiple
            max={2}
            onChange={onChangeFiles}
            name={locale.projectAddFiles}
            theme={theme}
          />
          <div
            className={clsx(s.files, filesActive ? s.active : '', load ? s.disabled : '')}
            ref={filesRef}
            onDrop={onDropFiles}
            onDragOver={onDragOverFiles}
            onDragLeave={onDragLeave}
          >
            {files.length === 0 && !filesActive && !touchpad && (
              <div className={s.drag__desc} style={{ color: theme.text }}>
                {locale.projectDragDropFiles}
              </div>
            )}
            {files.map((item) => (
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
                <IconButton onClick={deleteFileWrapper(item.id)}>
                  <DeleteIcon color={theme.text} />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
        <div className={s.files__accept} style={{ color: theme.text }}>
          {accept}
        </div>
        <div className={s.files__desc} style={{ color: theme.text }}>
          {locale.projectAddFilesDesc}
        </div>
      </form>
    </div>
  );
}

export default CreateProject;
