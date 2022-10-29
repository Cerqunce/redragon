import "./css/main.css";
import "./css/util.css";
import Table from "react-bootstrap/Table";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { DeleteReviewRoute, getAllReviewsRoute } from "../../api_routes";
import axios from "axios";
import { NavLink as Link, useNavigate } from "react-router-dom";

export default function AllReviews() {
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

  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const getReviews = async () => {
      const response = await axios.get(getAllReviewsRoute, {
        withCredentials: true,
      });
      setReviews(response.data);
    };
    getReviews();
  }, []);

  const deleteReview = async (id) => {
    await axios.post(DeleteReviewRoute, { id }, { withCredentials: true });
    const newReviews = reviews.filter((review) => review.id !== id);
    setReviews(newReviews);
  };
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 add">
            <Link
              to="/admin/add"
              className="add-review"
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
              <i className="fas fa-plus"></i>
              <h5 style={{ color: "white", paddingLeft: ".8rem" }}>
                Add Review
              </h5>
            </Link>

            <h2>All Reviews </h2>
            <br />
            <br />
            <div className="data-table">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Categoryy</th>
                    <th>Summary</th>
                    <th>Edit</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{review.updatedAt}</td>
                      <td>{review.title}</td>
                      <td>{review.type}</td>
                      <td>{review.summary}</td>
                      <td style={{ textAlign: "center", color: "green" }}>
                        <AiFillEdit />
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={(e) => deleteReview(review.id)}
                      >
                        <FaTrashAlt />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
