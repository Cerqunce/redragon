import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyCustomUploadAdapterPlugin from './UploadAdapter';

const EnhancedCKEditor = ({ data, onChange, onReady, placeholder = "Write your review here..." }) => {
  const editorConfiguration = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'fontSize',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'alignment',
        '|',
        'numberedList',
        'bulletedList',
        '|',
        'outdent',
        'indent',
        '|',
        'link',
        'blockQuote',
        'insertTable',
        '|',
        'imageUpload',
        'imageInsert',
        '|',
        'undo',
        'redo'
      ]
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
      ]
    },
    fontSize: {
      options: [9, 11, 13, 'default', 17, 19, 21]
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageResize:50',
        'imageResize:75',
        'imageResize:original'
      ],
      styles: [
        'full',
        'side',
        'alignLeft',
        'alignCenter',
        'alignRight'
      ],
      resizeOptions: [
        {
          name: 'imageResize:original',
          label: 'Original size',
          value: null
        },
        {
          name: 'imageResize:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'imageResize:75',
          label: '75%',
          value: '75'
        }
      ]
    },
    placeholder: placeholder
  };

  return (
    <div className="enhanced-editor-container">
      <div className="editor-info mb-2">
        <small className="text-muted">
          💡 <strong>Tip:</strong> You can drag & drop images directly into the editor or use the image upload button in the toolbar!
        </small>
      </div>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        config={editorConfiguration}
        onReady={onReady}
        onChange={onChange}
      />
      <div className="editor-help mt-2">
        <small className="text-muted">
          <strong>Image Tips:</strong>
          <ul className="mb-0 mt-1">
            <li>Click the image icon in the toolbar to upload images</li>
            <li>Drag and drop images directly into the editor</li>
            <li>Right-click on images to resize, add captions, or change alignment</li>
            <li>Supported formats: JPG, PNG, GIF, WebP</li>
          </ul>
        </small>
      </div>
    </div>
  );
};

export default EnhancedCKEditor;
