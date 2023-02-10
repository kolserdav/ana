import { useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

function HtmlEditor() {
  const [text, setText] = useState<any>();

  const onChangeText = useMemo(
    () => (e: any) => {
      setText(e);
    },
    []
  );
  console.log(text);
  return (
    <ReactQuill
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
            { align: [] },
          ],
          ['blockquote', 'code-block'],
          [{ direction: 'rtl' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ direction: 'rtl' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
      }}
      theme="snow"
      value={text}
      onChange={onChangeText}
    />
  );
}

export default HtmlEditor;
