import { useState, useEffect } from 'react';
import axios from 'axios';
import { getSiteSettingsRoute, updateSiteSettingsRoute, UploadeReviewRoute } from '../../api_routes';

export default function SiteSettings() {
  const [settings, setSettings] = useState({
    title: '',
    subtitle: '',
    heroImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(getSiteSettingsRoute);
      setSettings({
        title: response.data.title || '',
        subtitle: response.data.subtitle || '',
        heroImage: response.data.heroImage || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(UploadeReviewRoute, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.filename) {
        setSettings({
          ...settings,
          heroImage: `uploads/${response.data.filename}`
        });
        setSelectedFile(null);
        setMessage('Image uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(updateSiteSettingsRoute, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      setMessage('Site settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Error updating settings. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Site Settings</h4>
              <p className="card-text">Manage your website's hero section content</p>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="title">Hero Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={settings.title}
                        onChange={handleChange}
                        placeholder="Enter hero title"
                        required
                      />
                      <small className="form-text text-muted">
                        This will be displayed as the main title on your homepage
                      </small>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="subtitle">Hero Subtitle</label>
                      <input
                        type="text"
                        className="form-control"
                        id="subtitle"
                        name="subtitle"
                        value={settings.subtitle}
                        onChange={handleChange}
                        placeholder="Enter hero subtitle"
                        required
                      />
                      <small className="form-text text-muted">
                        This will be displayed as the subtitle on your homepage
                      </small>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="heroImage">Hero Background Image</label>
                  
                  {/* File Upload Option */}
                  <div className="mb-3">
                    <label className="form-label">Upload New Image</label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
                        onClick={handleImageUpload}
                        disabled={!selectedFile || uploadingImage}
                      >
                        {uploadingImage ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Uploading...
                          </>
                        ) : (
                          'Upload'
                        )}
                      </button>
                    </div>
                    <small className="form-text text-muted">
                      Upload a new background image for the hero section
                    </small>
                  </div>

                  {/* Manual URL/Path Option */}
                  <div className="mb-3">
                    <label className="form-label">Or Enter Image Path/URL</label>
                    <input
                      type="text"
                      className="form-control"
                      id="heroImage"
                      name="heroImage"
                      value={settings.heroImage}
                      onChange={handleChange}
                      placeholder="Enter image path or URL"
                    />
                    <small className="form-text text-muted">
                      Enter a URL (https://...) for external images or a local path (assets/img/image.jpg) for local images
                    </small>
                  </div>
                </div>

                {settings.heroImage && (
                  <div className="form-group">
                    <label>Preview:</label>
                    <div className="border rounded p-3" style={{ maxHeight: '200px', overflow: 'hidden' }}>
                      <img 
                        src={
                          settings.heroImage.startsWith('http') 
                            ? settings.heroImage 
                            : settings.heroImage.startsWith('uploads/')
                            ? `http://localhost:5000/api/${settings.heroImage}`
                            : `${process.env.PUBLIC_URL}/${settings.heroImage}`
                        } 
                        alt="Hero preview" 
                        className="img-fluid rounded"
                        style={{ maxHeight: '150px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Update Settings'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
