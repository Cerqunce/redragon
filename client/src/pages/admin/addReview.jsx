import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "./css/main.css";
import "./css/util.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

import axios from "axios";
import {
  CreateReviewRoute,
  UploadeReviewRoute,
  VerifyRoute,
} from "../../api_routes";

import { NavLink as Link, useNavigate } from "react-router-dom";
import { FaListUl } from "react-icons/fa";
import { useEffect } from "react";

export default function Admin() {
  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  //   return false;
  // }
  const navigate = useNavigate();

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
      alert("Please fill in all fields (title, content, category, summary) and select an image");
      return;
    }
    
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
        alert("Review created successfully!");
        navigate("/admin/all");
      } else {
        alert("Failed to create review: " + (createRes.data.msg || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data?.msg) {
        alert("Error: " + error.response.data.msg);
      } else if (error.response?.status === 400) {
        alert("Bad request: Please check all required fields are filled");
      } else {
        alert("Error: " + (error.message || "Unknown error"));
      }
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
            <h2>Create New Review </h2>
            <br />
            <br />
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Product Title"
                  onChange={handleTitleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Categoryy</Form.Label>
                <br />
                <Form.Select size="sm" onChange={handleCategoryChange}>
                  <option value={"null"}>None</option>
                  <option value={"keyboard"}>Keyboard</option>
                  <option value={"mouse"}>Mouse</option>
                  <option value={"kandm"}>Keyboard and mouse combo</option>
                  <option value={"speaker"}>Speaker</option>
                  <option value={"mousepad"}>Mousepad</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  placeholder="Password"
                  onChange={(e) => handleFileChange(e)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter a biref description. It will be displayed on the cards."
                  onChange={handleSummaryChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={handlesubmit}>
                Submit
              </Button>
            </Form>

            <div className="editor">
              <CKEditor
                editor={ClassicEditor}
                data="<p>Write Here Your Review</p>"
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
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
