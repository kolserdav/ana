import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import clsx from 'clsx';
import { HTML_EDITOR_HEIGHT, TINY_API_KEY } from '../../utils/constants';
import { Theme } from '../../Theme';
import s from './HtmlEditor.module.scss';
import { HTMLEditorOnChange } from '../../types';
import Typography from './Typography';
import { ubuntu500 } from '../../fonts/ubuntu';
import Loader from './Loader';

function HtmlEditor({
  onEditorChange,
  theme,
  id,
  label,
  value,
  placeholder,
  disabled,
  error,
}: {
  onEditorChange: HTMLEditorOnChange;
  id: string;
  theme: Theme;
  value: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  error?: string;
}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const editorRef = useRef(null);
  return (
    <div className={clsx(s.wrapper, ubuntu500.className, disabled ? s.disabled : '')}>
      <Typography
        className={s.label}
        htmlFor={id}
        theme={theme}
        variant="label"
        disabled={disabled}
      >
        {label}
      </Typography>
      <div className={s.container} style={error ? { border: `1px groove ${theme.red}` } : {}}>
        <Loader theme={theme} open={!loaded} iconHeight={24} noOpacity iconWidth={24} />
        <Editor
          onInit={(evt, editor) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editorRef.current = editor as any;
            setLoaded(true);
          }}
          onEditorChange={onEditorChange}
          id={id}
          disabled={disabled}
          key={theme.paper}
          apiKey={TINY_API_KEY}
          value={value}
          init={{
            language: 'ru',
            min_height: HTML_EDITOR_HEIGHT,
            skin: theme.type === 'dark' ? 'oxide-dark' : undefined,
            menubar: false,
            elementpath: false,
            placeholder,
            branding: false,
            plugins: [],
            toolbar:
              'undo redo | casechange blocks | bold italic underline | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist checklist outdent indent |  removeformat',
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
              min-height: calc(300px - 1rem);
            }
            `,
          }}
        />
      </div>
      <div style={{ color: theme.yellow }} className={s.error}>
        {error}
      </div>
    </div>
  );
}

HtmlEditor.defaultProps = {
  disabled: false,
  error: '',
};

export default HtmlEditor;
