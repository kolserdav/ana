import { File } from '@prisma/client';
import filesMime from '../data/files.json';
import { getFileExt, IMAGE_EXTS } from '../types/interfaces';
import { PUBLIC_ICONS_FILES } from '../utils/constants';

export const getFileIconPath = (file: File) => {
  let src = PUBLIC_ICONS_FILES;
  filesMime.forEach((item) => {
    const extM = getFileExt(file.filename);
    if (item.t === file.mimetype || extM === item.ext) {
      src += item.name;
    }
  });
  return src;
};

export const getAcceptedFiles = () => {
  let files = '';
  filesMime.forEach((item) => {
    files += item.ext;
    files += ', ';
  });
  files += IMAGE_EXTS;
  return files;
};

export const getColor = (mimetype: string) => {
  const file = filesMime.find((item) => item.t === mimetype);
  if (!file) {
    return 'gray';
  }
  return file.color;
};

export const removeFilesFromInput = (input: HTMLInputElement) => {
  const dt = new DataTransfer();
  const { files } = input;
  if (!files) {
    return;
  }
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    dt.items.add(file);
  }

  // eslint-disable-next-line no-param-reassign
  input.files = dt.files;
};
