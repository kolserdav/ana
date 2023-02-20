import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef } from 'react';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';
import { Locale } from '../types/interfaces';
import {
  IMAGE_PREVIEW_WIDTH,
  MAX_DATE_ACTUAL,
  MIN_DATE_ACTUAL,
  PROJECT_TITLE_MAX,
} from '../utils/constants';
import { getImagePath } from '../utils/lib';
import {
  useDescriptionInput,
  useEndDateInput,
  useInputFiles,
  useTitleInput,
} from './CreateProject.hooks';
import s from './CreateProject.module.scss';
import DeleteIcon from './icons/Delete';
import Button from './ui/Button';
import IconButton from './ui/IconButton';
import Input from './ui/Input';
import Typography from './ui/Typography';

const HtmlEditor = dynamic(() => import('./ui/HtmlEditor'), { ssr: false });

function CreateProject({
  theme,
  locale,
  formDesc,
  touchpad,
}: {
  theme: Theme;
  locale: Locale['app']['me'];
  formDesc: string;
  touchpad: boolean;
}) {
  const filesRef = useRef<HTMLDivElement>(null);

  const { load } = useLoad();

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
  } = useInputFiles();
  console.log(files);
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
            placeholder={locale.projectDesPlaceholder}
            id="description"
            label={`${locale.projectDescription}*`}
            onChange={onChangeDescription}
            theme={theme}
          />
        </div>
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
        <div className={s.files_container} style={{ backgroundColor: theme.active }}>
          {!filesActive && (
            <div className={s.button__files}>
              <Button theme={theme} onClick={onClickAddFiles}>
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
            multiple
            max={2}
            onChange={onChangeFiles}
            name={locale.projectAddFiles}
            theme={theme}
          />
          <div
            className={clsx(s.files, filesActive ? s.active : '')}
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
                  width={IMAGE_PREVIEW_WIDTH}
                  height={IMAGE_PREVIEW_WIDTH / (item.coeff || 1)}
                  src={getImagePath(item)}
                  alt=""
                />
                <IconButton>
                  <DeleteIcon color={theme.text} />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
        <div className={s.files__desc} style={{ color: theme.text }}>
          {locale.projectAddFilesDesc}
        </div>
      </form>
    </div>
  );
}

export default CreateProject;
