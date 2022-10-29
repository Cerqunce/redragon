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
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return false;
  }

  const navigate = useNavigate();

  const token = getCookie("token");

  console.log(token);

  if (!token) {
    navigate("/admin/");
  }

  useEffect(() => {
    const verify = async () => {
      const response = await axios.post(
        VerifyRoute,
        {},
        { withCredentials: true }
      );
      if (!response.data.status) {
        navigate("/admin/");
      }
    };
    if (token !== "") {
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
    if (!title || !content || !file) {
      return;
    }
    const fd = new FormData();
    fd.append("image", file);
    const config = {
      method: "post",
      url: UploadeReviewRoute,
      data: fd,
    };

    axios(config).then((res) => {
      console.log(res.data);
      const data = {
        title,
        content,
        category,
        summary,
        image: res.data.path,
      };
      axios.post(CreateReviewRoute, data).then((res) => {
        console.log(res.data);
        navigate("/admin/all");
      });
    });
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
