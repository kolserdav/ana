import { File } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HTMLEditorOnChange } from '../types';
import { getMaxBodySize, Locale, MessageType, SendMessageArgs } from '../types/interfaces';
import { ALERT_DURATION, Pages, PROJECT_TITLE_MAX, SELECTED_TAG_MAX } from '../utils/constants';
import { log } from '../utils/lib';
import Request from '../utils/request';
import { removeFilesFromInput } from './CreateProject.lib';

const request = new Request();

export const useDescriptionInput = () => {
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string>('');

  const onChangeDescription: HTMLEditorOnChange = (e) => {
    setDescription(e);
    if (e && descriptionError) {
      setDescriptionError('');
    }
  };

  return {
    description,
    onChangeDescription,
    descriptionError,
    setDescriptionError,
    setDescription,
  };
};

export const useTitleInput = () => {
  const [title, setTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length > PROJECT_TITLE_MAX) {
      return;
    }
    if (value.length !== 0 && titleError) {
      setTitleError('');
    }
    setTitle(value);
  };

  return { title, onChangeTitle, titleError, setTitleError, setTitle };
};

export const useEndDateInput = () => {
  const [endDate, setEndDate] = useState<string>('');
  const [endDateError, setEndDateError] = useState<string>('');

  const onChangeEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    if (endDateError) {
      setEndDateError('');
    }
  };
  return { endDate, onChangeEndDate, endDateError, setEndDateError, setEndDate };
};

export const useInputFiles = ({
  somethingWentWrong,
  maxFileSize,
  load,
}: {
  load: boolean;
  somethingWentWrong: string;
  maxFileSize: string;
}) => {
  const inputFilesRef = useRef<HTMLInputElement>(null);

  const [filesLoad, setFilesLoad] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [filesActive, setFilesActive] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>(false);

  const saveLocalFiles = async (_files: FileList) => {
    setFilesLoad(true);
    const formData = new FormData();
    for (let i = 0; _files[i]; i++) {
      const { size, name } = _files[i];
      if (size > getMaxBodySize()) {
        setTimeout(() => {
          log('warn', `${maxFileSize}: ${name}`, { size }, true);
        }, 200 * i);
        // eslint-disable-next-line no-continue
        continue;
      }
      formData.append(`file-${i}`, _files[i]);
    }
    const res = await request.fileUpload(formData);
    if (res.type === MessageType.SET_ERROR) {
      log(res.data.status, res.data.message, { res }, true);
    } else if (!res.type) {
      log('error', somethingWentWrong, { res }, true);
    }
    setRestart(!restart);
    setFilesLoad(false);
  };

  const deleteFileWrapper = (fileId: string) => async () => {
    const res = await request.fileDelete({ fileId });
    if (res.type === MessageType.SET_ERROR) {
      log(res.data.status, res.data.message, { res }, true);
    }
    setRestart(!restart);
  };

  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files: _files },
    } = e;
    if (!_files) {
      return;
    }
    saveLocalFiles(_files);
  };

  const onDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    if (load || filesLoad) {
      return;
    }
    e.preventDefault();
    const {
      dataTransfer: { files: _files },
    } = e;
    if (!_files) {
      return;
    }
    saveLocalFiles(_files);
    setFilesActive(false);
  };

  const onDragOverFiles = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setFilesActive(true);
  };

  const onDragLeave = () => {
    if (!load || !filesLoad) {
      setFilesActive(false);
    }
  };

  const onClickAddFiles = () => {
    const { current } = inputFilesRef;
    if (!current) {
      return;
    }
    current.click();
  };

  /**
   * Get upload files
   */
  useEffect(() => {
    (async () => {
      setFilesLoad(true);
      const res = await request.fileFindMany();
      if (res.type === MessageType.SET_ERROR) {
        return;
      }
      setFiles(res.data);
      setFilesLoad(false);
    })();
  }, [restart]);

  return {
    onChangeFiles,
    files,
    onDropFiles,
    onDragOverFiles,
    filesActive,
    onDragLeave,
    onClickAddFiles,
    inputFilesRef,
    deleteFileWrapper,
    filesLoad,
    setFiles,
  };
};

export const useBeforeUnload = ({
  files,
  title,
  description,
  endDate,
  filesLoad,
  selectedLength,
  categorySelected,
}: {
  files: File[];
  title: string;
  description: string;
  endDate: string;
  filesLoad: boolean;
  selectedLength: number;
  categorySelected: boolean;
}) => {
  /**
   * Clen files if project not created
   */
  useEffect(() => {
    const beforeUnloadHandler = async (ev: Event) => {
      if (
        files.length === 0 &&
        !filesLoad &&
        !title &&
        !description &&
        !endDate &&
        !categorySelected &&
        selectedLength === 0
      ) {
        return;
      }
      ev.preventDefault();
      for (let i = 0; files[i]; i++) {
        const file = files[i];
        request.fileDelete({
          fileId: file.id,
        });
      }
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [files, title, description, endDate, filesLoad, categorySelected, selectedLength]);
};

export const useSelectCategory = () => {
  const [categories, setCategories] = useState<
    SendMessageArgs<MessageType.SET_CATEGORY_FIND_MANY>['data']
  >([]);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [selectedSubcats, setSelectedSubcats] = useState<number[]>([]);

  const cheepDisabled = selectedSubcats.length >= SELECTED_TAG_MAX;

  /**
   * Set categories
   */
  useEffect(() => {
    (async () => {
      const categs = await request.categoryFindMany();
      if (categs.type === MessageType.SET_ERROR) {
        log('error', categs.data.message, { categs }, true);
        return;
      }
      setCategories(categs.data);
    })();
  }, []);

  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;
    setActiveCategory(parseInt(value, 10));
    setSelectedSubcats([]);
  };

  const category = useMemo(
    () => categories.find((item) => item.id === activeCategory),
    [categories, activeCategory]
  );

  const onClickTagWrapper =
    (id: number, del = false) =>
    () => {
      const sels = selectedSubcats.slice();
      if (del) {
        const index = sels.indexOf(id);
        if (index === -1) {
          log('warn', 'Deleted tag is missing', { sels, id });
          return;
        }
        sels.splice(index, 1);
        setSelectedSubcats(sels);
        return;
      }
      if (sels.indexOf(id) !== -1) {
        log('warn', 'Duplicate tag', { id, sels });
        return;
      }
      sels.push(id);
      setSelectedSubcats(sels);
    };

  return {
    categories,
    activeCategory,
    onChangeCategory,
    category,
    onClickTagWrapper,
    selectedSubcats,
    cheepDisabled,
    setSelectedSubcats,
    setActiveCategory,
  };
};

export const useButtonCreate = ({
  setLoad,
  title,
  endDate,
  description,
  files,
  setEndDateError,
  setDescriptionError,
  setTitleError,
  fieldMustBeNotEmpty,
  eliminateRemarks,
  selectedSubcats,
  locale,
  cleanAllFields,
}: {
  title: string;
  description: string;
  endDate: string;
  files: File[];
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setTitleError: React.Dispatch<React.SetStateAction<string>>;
  setDescriptionError: React.Dispatch<React.SetStateAction<string>>;
  setEndDateError: React.Dispatch<React.SetStateAction<string>>;
  fieldMustBeNotEmpty: string;
  eliminateRemarks: string;
  selectedSubcats: number[];
  cleanAllFields: () => void;
  locale: Locale['app']['me'];
}) => {
  const router = useRouter();

  const [buttonError, setButtonError] = useState<string>('');

  // eslint-disable-next-line no-unused-vars
  const onClickButtonCreate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let error = false;
    if (!title) {
      setTitleError(fieldMustBeNotEmpty);
      error = true;
    }
    if (!description) {
      setDescriptionError(fieldMustBeNotEmpty);
      error = true;
    }
    if (!endDate) {
      setEndDateError(fieldMustBeNotEmpty);
      error = true;
    }
    if (error) {
      setButtonError(eliminateRemarks);
      return;
    }
    if (buttonError) {
      setButtonError('');
    }
    setLoad(true);
    const res = await request.projectCreate({
      title,
      description,
      files: files.map((item) => item.id),
      subcategories: selectedSubcats,
      endDate,
    });
    if (res.type === MessageType.SET_ERROR) {
      setLoad(false);
      log(res.data.status, res.data.message, { res }, true);
      return;
    }
    log('info', locale.projectCreated, { res }, true);
    cleanAllFields();
    setTimeout(() => {
      setLoad(false);
      router.push(`${Pages.project}/${res.data.id}`);
    }, ALERT_DURATION);
  };

  return { onClickButtonCreate, buttonError };
};

export const useCleanForm = ({
  setTitleError,
  setTitle,
  setDescription,
  setDescriptionError,
  setEndDate,
  setFiles,
  setSelectedSubcats,
  setEndDateError,
  setActiveCategory,
  filesRef,
}: {
  setTitleError: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setDescriptionError: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDateError: React.Dispatch<React.SetStateAction<string>>;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setSelectedSubcats: React.Dispatch<React.SetStateAction<number[]>>;
  setActiveCategory: React.Dispatch<React.SetStateAction<number>>;
  filesRef: React.RefObject<HTMLDivElement>;
}) => {
  const cleanAllFields = () => {
    const { current } = filesRef;
    const input = current?.querySelector('input');
    if (input) {
      removeFilesFromInput(input);
    }
    setTitleError('');
    setTitle('');
    setDescription('');
    setDescriptionError('');
    setEndDate('');
    setFiles([]);
    setSelectedSubcats([]);
    setEndDateError('');
    setActiveCategory(0);
  };

  return { cleanAllFields };
};
