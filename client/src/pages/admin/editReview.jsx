import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "./css/main.css";
import "./css/util.css";
import "./css/enhanced-admin.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useState, useEffect } from "react";

import axios from "axios";
import {
  CreateReviewRoute,
  UploadeReviewRoute,
  VerifyRoute,
  singleReviewRoute,
  baseURL,
} from "../../api_routes";

import { NavLink as Link, useNavigate, useParams } from "react-router-dom";
import { FaListUl, FaSave, FaArrowLeft } from "react-icons/fa";

export default function EditReview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token || token === null) {
      navigate("/admin/");
      return;
    }

    const verify = async () => {
      try {
        const response = await axios.post(VerifyRoute, { token });
        if (!response.data.status) {
          navigate("/admin/");
          return;
        }
      } catch (error) {
        console.log("Token verification failed, redirecting to login");
        sessionStorage.removeItem("token");
        navigate("/admin/");
        return;
      }
    };

    const fetchReview = async () => {
      try {
        setLoading(true);
        const response = await axios.post(singleReviewRoute, { id });
        const review = response.data;
        
        setTitle(review.title || "");
        setContent(review.content || "");
        setCategory(review.type || "");
        setSummary(review.summary || "");
        setCurrentImage(review.image || "");
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching review:", error);
        showAlert("Error fetching review data", "danger");
        setLoading(false);
      }
    };

    verify();
    if (id) {
      fetchReview();
    }
  }, [id, navigate]);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 5000);
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content || !category || !summary) {
      showAlert("Please fill in all fields (title, content, category, summary)", "warning");
      return;
    }

    setSaving(true);

    try {
      let imagePath = currentImage;

      // Upload new image if selected
      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        const config = {
          method: "post",
          url: UploadeReviewRoute,
          data: fd,
        };

        const uploadRes = await axios(config);
        imagePath = uploadRes.data.path;
      }

      const data = {
        id,
        title,
        content,
        category,
        summary,
        image: imagePath,
        token: sessionStorage.getItem("token"),
      };

      const updateRes = await axios.post(`${baseURL}blogs/update`, data);
      
      if (updateRes.data.status) {
        showAlert("Review updated successfully!", "success");
        setTimeout(() => navigate("/admin/all"), 2000);
      } else {
        showAlert("Failed to update review: " + (updateRes.data.msg || "Unknown error"), "danger");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data?.msg) {
        showAlert("Error: " + error.response.data.msg, "danger");
      } else {
        showAlert("Error: " + (error.message || "Unknown error"), "danger");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 add">
            <div className="text-center">
              <h3>Loading review data...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 add">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Link
                to="/admin/all"
                className="btn btn-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaArrowLeft />
                Back to Reviews
              </Link>
              
              <Link
                to="/admin/all"
                className="all-reviews"
                style={{
                  borderRadius: "10px",
                  background: "linear-gradient(-135deg, #051922, #4158d0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                }}
              >
                <FaListUl />
                <span style={{ marginLeft: "0.5rem" }}>All Reviews</span>
              </Link>
            </div>

            {alert.show && (
              <Alert variant={alert.variant} className="mb-3">
                {alert.message}
              </Alert>
            )}

            <h2>Edit Review</h2>
            <br />

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Product Title"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select size="sm" value={category} onChange={handleCategoryChange} required>
                  <option value="">Select Category</option>
                  <option value="keyboard">Keyboard</option>
                  <option value="mouse">Mouse</option>
                  <option value="kandm">Keyboard and mouse combo</option>
                  <option value="speaker">Speaker</option>
                  <option value="mousepad">Mousepad</option>
                  <option value="headset">Headset</option>
                  <option value="webcam">Webcam</option>
                  <option value="microphone">Microphone</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Current Image</Form.Label>
                {currentImage && (
                  <div className="mb-2">
                    <img 
                      src={`${baseURL.replace('/api/', '')}uploads/${currentImage.replace('uploads/', '').replace('uploads\\', '')}`}
                      alt="Current review image"
                      style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover" }}
                      className="img-thumbnail"
                    />
                  </div>
                )}
                <Form.Label>Change Image (optional)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/png, image/gif, image/jpeg, image/webp"
                  onChange={handleFileChange}
                />
                <Form.Text className="text-muted">
                  Leave empty to keep current image
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter a brief description. It will be displayed on the cards."
                  value={summary}
                  onChange={handleSummaryChange}
                  required
                />
              </Form.Group>

              <div className="d-flex gap-2 mb-3">
                <Button 
                  variant="success" 
                  type="submit" 
                  disabled={saving}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <FaSave />
                  {saving ? "Updating..." : "Update Review"}
                </Button>
                <Button 
                  variant="secondary" 
                  type="button"
                  onClick={() => navigate("/admin/all")}
                >
                  Cancel
                </Button>
              </div>
            </Form>

            <div className="editor">
              <h5>Review Content</h5>
              <CKEditor
                editor={ClassicEditor}
                data={content}
                config={{
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
                    options: [ 9, 11, 13, 'default', 17, 19, 21 ]
                  },
                  table: {
                    contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
                  }
                }}
                onReady={(editor) => {
                  console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContent(data);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
