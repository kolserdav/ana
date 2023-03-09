import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useMemo, useRef } from 'react';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';
import { isImage, Locale, MAX_BODY_MB, MessageType, SendMessageArgs } from '../types/interfaces';
import {
  IMAGE_PREVIEW_WIDTH,
  MAX_DATE_ACTUAL,
  MIN_DATE_ACTUAL,
  PROJECT_TITLE_MAX,
  SELECTED_TAG_MAX,
} from '../utils/constants';
import { getFilePath } from '../utils/lib';
import {
  useBeforeUnload,
  useButtonCreate,
  useCleanForm,
  useDescriptionInput,
  useEndDateInput,
  useInputFiles,
  useSelectCategory,
  useTitleInput,
} from './CreateProject.hooks';
import { getAcceptedFiles, getFileIconPath } from './CreateProject.lib';
import s from './CreateProject.module.scss';
import DeleteIcon from './icons/Delete';
import HelpIcon from './icons/Help';
import Button from './ui/Button';
import Cheep from './ui/Cheep';
import IconButton from './ui/IconButton';
import Image from './ui/Image';
import Input from './ui/Input';
import Select from './ui/Select';
import Tooltip from './ui/Tooltip';
import Typography from './ui/Typography';

const HtmlEditor = dynamic(() => import('./ui/HtmlEditor'));

function CreateProject({
  theme,
  locale,
  formDesc,
  touchpad,
  showHelp,
  somethingWentWrong,
  maxFileSize,
  fieldMustBeNotEmpty,
  eliminateRemarks,
  projectAddFiles,
  user,
}: {
  theme: Theme;
  locale: Locale['app']['createProject'];
  formDesc: string;
  touchpad: boolean;
  showHelp: string;
  somethingWentWrong: string;
  maxFileSize: string;
  fieldMustBeNotEmpty: string;
  eliminateRemarks: string;
  projectAddFiles: string;
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'];
}) {
  const filesRef = useRef<HTMLDivElement>(null);

  const helpDateRef = useRef<HTMLButtonElement>(null);
  const helpCategRef = useRef<HTMLButtonElement>(null);

  const { load, setLoad } = useLoad();

  const {
    description,
    onChangeDescription,
    descriptionError,
    setDescriptionError,
    setDescription,
  } = useDescriptionInput();

  const { onChangeTitle, title, titleError, setTitleError, setTitle } = useTitleInput();

  const { endDate, onChangeEndDate, endDateError, setEndDateError, setEndDate } = useEndDateInput();

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
    filesLoad,
    setFiles,
  } = useInputFiles({ load, somethingWentWrong, maxFileSize });

  const accept = useMemo(() => getAcceptedFiles(), []);

  const {
    categories,
    activeCategory,
    onChangeCategory,
    category,
    onClickTagWrapper,
    selectedSubcats,
    cheepDisabled,
    setSelectedSubcats,
    setActiveCategory,
  } = useSelectCategory();

  useBeforeUnload({
    files,
    title,
    description,
    endDate,
    filesLoad,
    categorySelected: category !== undefined,
    selectedLength: selectedSubcats.length,
  });

  const subCats = useMemo(
    () => category?.Subcategory.filter((item) => selectedSubcats.indexOf(item.id) === -1) || [],
    [category, selectedSubcats]
  );

  const selSubCats = useMemo(
    () => category?.Subcategory.filter((item) => selectedSubcats.indexOf(item.id) !== -1) || [],
    [category, selectedSubcats]
  );

  const { cleanAllFields } = useCleanForm({
    setDescription,
    setDescriptionError,
    setEndDate,
    setFiles,
    setSelectedSubcats,
    setTitle,
    setTitleError,
    setEndDateError,
    setActiveCategory,
    filesRef,
  });

  const { onClickButtonCreate, buttonError } = useButtonCreate({
    title,
    description,
    endDate,
    setLoad,
    files,
    setTitleError,
    setEndDateError,
    setDescriptionError,
    fieldMustBeNotEmpty,
    eliminateRemarks,
    selectedSubcats,
    locale,
    cleanAllFields,
    meEmployer: user?.role === 'employer',
  });

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
          disabled={load}
          onChange={onChangeTitle}
          name={`${locale.projectTitle}*`}
          desc={`${title.length}/${PROJECT_TITLE_MAX}`}
          theme={theme}
          error={titleError}
        />
        <div className={s.html__editor}>
          <HtmlEditor
            disabled={load}
            value={description}
            placeholder={locale.projectDesPlaceholder}
            id="description"
            label={`${locale.projectDescription}*`}
            onEditorChange={onChangeDescription}
            theme={theme}
            error={descriptionError}
          />
        </div>
        <div className={s.date}>
          <Input
            disabled={load}
            theme={theme}
            id="actual-for"
            type="date"
            min={MIN_DATE_ACTUAL}
            max={MAX_DATE_ACTUAL}
            name={`${locale.projectActualFor}*`}
            value={endDate}
            onChange={onChangeEndDate}
            error={endDateError}
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
              <Button theme={theme} disabled={load || filesLoad} onClick={onClickAddFiles}>
                {projectAddFiles}
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
            onChange={onChangeFiles}
            name={projectAddFiles}
            theme={theme}
          />
          <div
            className={clsx(
              s.files,
              filesActive ? s.active : '',
              load || filesLoad ? s.disabled : ''
            )}
            ref={filesRef}
            onDrop={onDropFiles}
            onDragOver={onDragOverFiles}
            onDragLeave={onDragLeave}
          >
            {filesLoad && <div className={s.loader} />}
            {files.length === 0 && !filesActive && !touchpad && (
              <div className={s.drag__desc} style={{ color: theme.text }}>
                {locale.projectDragDropFiles}
              </div>
            )}
            {files.map((item) => (
              <div className={s.item} key={item.id} title={item.filename}>
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
          {locale.projectAddFilesDesc}. {locale.maxFileSizeIs}: {MAX_BODY_MB}M
        </div>
        <div className={s.categs}>
          <div className={s.categ}>
            <div className={s.select}>
              <Select
                disabled={load}
                aria-label={locale.categoryLabel}
                id="select-categ"
                theme={theme}
                onChange={onChangeCategory}
                value={activeCategory}
              >
                <option value={0}>{locale.withoutCategory}</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
              <IconButton ref={helpCategRef} title={showHelp}>
                <HelpIcon color={theme.blue} />
              </IconButton>
              <Tooltip current={helpCategRef.current} theme={theme}>
                {`${locale.categoryHelp} ${SELECTED_TAG_MAX}`}
              </Tooltip>
            </div>
            <div className={s.selected__sub_cats}>
              {selSubCats.map((item) => (
                <Cheep onClick={onClickTagWrapper(item.id, true)} key={item.id} theme={theme}>
                  {item.name}
                </Cheep>
              ))}
            </div>
          </div>
          <div className={s.sub_cats}>
            {subCats.map((item) => (
              <Cheep
                onClick={onClickTagWrapper(item.id)}
                disabled={cheepDisabled}
                add
                key={item.id}
                theme={theme}
              >
                {item.name}
              </Cheep>
            ))}
          </div>
        </div>
        <div className={s.actions}>
          <Button
            error={buttonError}
            theme={theme}
            disabled={load || filesLoad}
            onClick={onClickButtonCreate}
          >
            {locale.buttonCreate}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateProject;
