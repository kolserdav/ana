import { useRef, useState } from 'react';
import { HTMLEditorOnChange } from '../types';
import { DATE_NOW } from '../utils/constants';

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

  const [files, setFiles] = useState<FileList[]>([]);
  const [filesActive, setFilesActive] = useState<boolean>(false);

  const saveLocalFiles = (_files: FileList) => {
    let filesCopy = files.slice();
    filesCopy = filesCopy.concat(_files);
    setFiles(filesCopy);
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

  return {
    onChangeFiles,
    files,
    onDropFiles,
    onDragOverFiles,
    filesActive,
    onDragLeave,
    onClickAddFiles,
    inputFilesRef,
  };
};
