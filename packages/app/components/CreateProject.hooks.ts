import { File } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { HTMLEditorOnChange } from '../types';
import { MessageType } from '../types/interfaces';
import { PROJECT_TITLE_MAX } from '../utils/constants';
import { log } from '../utils/lib';
import Request from '../utils/request';

const request = new Request();

export const useDescriptionInput = () => {
  const [description, setDescription] = useState('');

  const onChangeDescription: HTMLEditorOnChange = (e) => {
    const _e: {
      readonly level: {
        readonly content: string;
      };
    } = e as any;
    setDescription(_e.level.content);
  };

  return { description, onChangeDescription };
};

export const useTitleInput = () => {
  const [title, setTitle] = useState<string>('');

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (value.length > PROJECT_TITLE_MAX) {
      return;
    }
    setTitle(value);
  };

  return { title, onChangeTitle };
};

export const useEndDateInput = () => {
  const [endDate, setEndDate] = useState<string>('');

  const onChangeEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };
  return { endDate, onChangeEndDate };
};

export const useInputFiles = () => {
  const inputFilesRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [filesActive, setFilesActive] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>(false);

  const saveLocalFiles = async (_files: FileList) => {
    const formData = new FormData();
    for (let i = 0; _files[i]; i++) {
      formData.append(`file-${i}`, _files[i]);
    }
    const res = await request.fileUpload(formData);
    if (res.type === MessageType.SET_ERROR) {
      log(res.data.status, res.data.message, { res }, true);
    }
    setRestart(!restart);
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
    setFilesActive(false);
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
      const res = await request.fileFindMany();
      setFiles(res.data);
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
  };
};
