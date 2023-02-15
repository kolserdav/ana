import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import clsx from 'clsx';
import { TINY_API_KEY } from '../../utils/constants';
import { Theme } from '../../Theme';
import s from './HtmlEditor.module.scss';
import { HTMLEditorOnChange } from '../../types';
import Typography from './Typography';
import { ubuntu500 } from '../../fonts/ubuntu';

export default function HtmlEditor({
  onChange,
  theme,
  id,
  label,
  placeholder,
}: {
  onChange: HTMLEditorOnChange;
  id: string;
  theme: Theme;
  label: string;
  placeholder: string;
}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const editorRef = useRef(null);
  return (
    <div className={clsx(s.wrapper, loaded ? s.loaded : '')}>
      <Typography
        className={clsx(s.label, ubuntu500.className)}
        htmlFor={id}
        theme={theme}
        variant="label"
      >
        {label}
      </Typography>
      <Editor
        onInit={(evt, editor) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          editorRef.current = editor as any;
          setLoaded(true);
        }}
        onChange={onChange}
        id={id}
        apiKey={TINY_API_KEY}
        init={{
          language: 'ru',
          min_height: 300,
          skin: theme.type === 'dark' ? 'oxide-dark' : undefined,
          menubar: false,
          elementpath: false,
          placeholder,
          branding: false,
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
            'image',
          ],
          toolbar:
            'undo redo | casechange blocks | bold italic underline | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist checklist outdent indent | table image |  removeformat',
          content_style: `
            .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
              color: ${theme.text};
              opacity: 0.5;
            }
            body { 
              font-family:Helvetica,Arial,sans-serif; font-size:14px;
              background-color: ${theme.paper};
              color: ${theme.text};
              cursor: text;
              min-height: 300px;
            }
            `,
        }}
      />
    </div>
  );
}
