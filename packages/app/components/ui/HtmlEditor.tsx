import React from 'react';
import { CKEditor } from 'ckeditor4-react';

function App() {
  return (
    <CKEditor
      config={{
        language: 'ru',
      }}
      initData=""
    />
  );
}

export default App;
