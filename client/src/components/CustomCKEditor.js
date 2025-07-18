// Custom CKEditor configuration with image upload
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class CustomEditor extends ClassicEditor {
  static create(element, config = {}) {
    // Merge custom config with default
    const customConfig = {
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
          'imageResize'
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
            name: 'resizeImage:original',
            label: 'Original',
            value: null
          },
          {
            name: 'resizeImage:50',
            label: '50%',
            value: '50'
          },
          {
            name: 'resizeImage:75',
            label: '75%',
            value: '75'
          }
        ]
      },
      // Custom image upload adapter
      simpleUpload: {
        uploadUrl: process.env.NODE_ENV === 'production' 
          ? 'https://redragon-production.up.railway.app/api/blogs/upload-content-image'
          : 'http://localhost:5000/api/blogs/upload-content-image',
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      },
      ...config
    };

    return super.create(element, customConfig);
  }
}

export default CustomEditor;
