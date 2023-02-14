import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import clsx from 'clsx';
import { TINY_API_KEY } from '../../utils/constants';
import { Theme } from '../../Theme';
import s from './HtmlEditor.module.scss';
import { HTMLEditorOnChange } from '../../types';

export default function HtmlEditor({
  onChange,
  theme,
}: {
  onChange: HTMLEditorOnChange;
  theme: Theme;
}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const editorRef = useRef(null);

  return (
    <div className={clsx(s.wrapper, loaded ? s.loaded : '')}>
      <Editor
        onInit={(evt, editor) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          editorRef.current = editor as any;
          setLoaded(true);
        }}
        onChange={onChange}
        apiKey={TINY_API_KEY}
        init={{
          language: 'ru',
          height: 500,
          skin: theme.type === 'dark' ? 'oxide-dark' : undefined,
          menubar: false,
          plugins: [
            'advlist',
            'advcode',
            'advtable',
            'autolink',
            'checklist',
            'export',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'powerpaste',
            'fullscreen',
            'formatpainter',
            'insertdatetime',
            'media',
            'table',
            'wordcount',
            'image',
          ],
          toolbar:
            'undo redo | casechange blocks | bold italic backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist checklist outdent indent | table image |  removeformat',
          content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: ${theme.paper}; color: ${theme.text}}`,
        }}
      />
    </div>
  );
}
