import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import EnhancedCKEditor from "../../components/EnhancedCKEditor";

import "./css/main.css";
import "./css/util.css";
import "./css/enhanced-admin.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";

import axios from "axios";
import {
  CreateReviewRoute,
  UploadeReviewRoute,
  VerifyRoute,
} from "../../api_routes";

import { NavLink as Link, useNavigate } from "react-router-dom";
import { FaListUl, FaPlus, FaSave } from "react-icons/fa";
import { useEffect } from "react";

export default function Admin() {
  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  //   return false;
  // }
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token || token === null) {
      navigate("/admin/");
    }

    const verify = async () => {
      try {
        const response = await axios.post(VerifyRoute, { token });
        if (!response.data.status) {
          navigate("/admin/");
        }
      } catch (error) {
        // Token verification failed, redirect to login
        console.log("Token verification failed, redirecting to login");
        sessionStorage.removeItem("token");
        navigate("/admin/");
      }
    };
    if (token && token !== null) {
      verify();
    }
  }, []);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 5000);
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(null);
  const [summary, setSummary] = useState("");

  const [file, setFile] = useState(null);

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

  const handlesubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!title || !content || !category || !summary || !file) {
      showAlert("Please fill in all fields (title, content, category, summary) and select an image", "warning");
      return;
    }
    
    setSaving(true);
    
    const fd = new FormData();
    fd.append("image", file);
    const config = {
      method: "post",
      url: UploadeReviewRoute,
      data: fd,
    };

    try {
      const uploadRes = await axios(config);
      console.log("Image upload response:", uploadRes.data);
      
      const data = {
        title,
        content,
        category,
        summary,
        image: uploadRes.data.path,
        token: sessionStorage.getItem("token"),
      };
      
      console.log("Creating review with data:", data);
      
      const createRes = await axios.post(CreateReviewRoute, data);
      console.log("Review creation response:", createRes.data);
      
      if (createRes.data.status) {
        showAlert("Review created successfully!", "success");
        setTimeout(() => navigate("/admin/all"), 2000);
      } else {
        showAlert("Failed to create review: " + (createRes.data.msg || "Unknown error"), "danger");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data?.msg) {
        showAlert("Error: " + error.response.data.msg, "danger");
      } else if (error.response?.status === 400) {
        showAlert("Bad request: Please check all required fields are filled", "warning");
      } else {
        showAlert("Error: " + (error.message || "Unknown error"), "danger");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 add">
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
                fontSize: "20px",
                fontWeight: "bold",
                width: "10rem",
                padding: "0.5rem",
                marginLeft: "auto",
              }}
            >
              <FaListUl />
              <h5 style={{ color: "white", paddingLeft: ".8rem" }}>
                All Review
              </h5>
            </Link>
            
            {alert.show && (
              <Alert variant={alert.variant} className="mb-3">
                {alert.message}
              </Alert>
            )}
            
            <h2>Create New Review </h2>
            <br />
            <br />
            <Form onSubmit={handlesubmit}>
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
                <br />
                <Form.Select size="sm" value={category} onChange={handleCategoryChange} required>
                  <option value="">Select Category</option>
                  <option value={"keyboard"}>Keyboard</option>
                  <option value={"mouse"}>Mouse</option>
                  <option value={"kandm"}>Keyboard and mouse combo</option>
                  <option value={"speaker"}>Speaker</option>
                  <option value={"mousepad"}>Mousepad</option>
                  <option value={"headset"}>Headset</option>
                  <option value={"webcam"}>Webcam</option>
                  <option value={"microphone"}>Microphone</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/png, image/gif, image/jpeg, image/webp"
                  onChange={(e) => handleFileChange(e)}
                  required
                />
                <Form.Text className="text-muted">
                  Supported formats: PNG, GIF, JPEG, WebP
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
              
              <Button 
                variant="success" 
                type="submit" 
                disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}
              >
                <FaSave />
                {saving ? "Creating..." : "Create Review"}
              </Button>
            </Form>

            <div className="editor">
              <h5>Review Content</h5>
              <EnhancedCKEditor
                data="<p>Write Here Your Review</p>"
                onReady={(editor) => {
                  console.log("Enhanced Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContent(data);
                }}
                placeholder="Write your detailed review here. You can add images, format text, create tables, and much more!"
              />
            </div>
          </div>
        </div>
      </div>

      <script src="vendor/jquery/jquery-3.2.1.min.js"></script>
      <script src="vendor/bootstrap/js/popper.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
      <script src="vendor/select2/select2.min.js"></script>
      <script src="vendor/tilt/tilt.jquery.min.js"></script>
      {/* <script>
        $('.js-tilt').tilt(
        {{
          scale: 1.1,
        }}
        )
      </script> */}
      <script src="js/main.js"></script>
    </>
  );
}
