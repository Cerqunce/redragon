import "./css/main.css";
import "./css/util.css";
import "./css/enhanced-admin.css";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt, FaSearch, FaPlus, FaHome } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { DeleteReviewRoute, getAllReviewsRoute, VerifyRoute } from "../../api_routes";
import axios from "axios";
import { NavLink as Link, useNavigate } from "react-router-dom";

export default function AllReviews() {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  };
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
        console.log("Token verification failed, redirecting to login");
        sessionStorage.removeItem("token");
        navigate("/admin/");
      }
    };

    const getReviews = async () => {
      try {
        const response = await axios.get(getAllReviewsRoute);
        setReviews(response.data);
        setFilteredReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        showAlert("Failed to fetch reviews", "danger");
      }
    };

    if (token && token !== null) {
      verify();
      getReviews();
    }
  }, []);

  // Filter reviews based on search term and category
  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(review => review.type === selectedCategory);
    }

    setFilteredReviews(filtered);
  }, [searchTerm, selectedCategory, reviews]);

  const deleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const token = sessionStorage.getItem("token");
        await axios.post(DeleteReviewRoute, { id, token });
        const newReviews = reviews.filter((review) => review.id !== id);
        setReviews(newReviews);
        showAlert("Review deleted successfully", "success");
      } catch (error) {
        console.error("Failed to delete review:", error);
        showAlert("Failed to delete review", "danger");
      }
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(reviews.map(review => review.type).filter(Boolean))];
    return categories;
  };
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 add" style={{ maxWidth: "1200px", width: "95%" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Link
                to="/admin/dashboard"
                className="btn btn-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaHome />
                Dashboard
              </Link>
              
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
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                }}
              >
                <FaPlus />
                <span style={{ marginLeft: "0.5rem" }}>Add Review</span>
              </Link>
            </div>

            {alert.show && (
              <Alert variant={alert.variant} className="mb-3">
                {alert.message}
              </Alert>
            )}

            <h2>All Reviews ({filteredReviews.length})</h2>
            
            {/* Search and Filter Controls */}
            <div className="row mb-3">
              <div className="col-md-6">
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search reviews by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="col-md-4">
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-2">
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            
            <br />
            <div className="data-table">
              <Table striped bordered hover responsive>
                <thead style={{ background: "linear-gradient(-135deg, #051922, #4158d0)", color: "white" }}>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Summary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review, index) => (
                      <tr key={review.id}>
                        <td>{index + 1}</td>
                        <td>
                          {new Date(review.updatedAt).toLocaleDateString()}
                        </td>
                        <td>
                          <strong>{review.title}</strong>
                        </td>
                        <td>
                          <span className="badge bg-primary">{review.type}</span>
                        </td>
                        <td>
                          {review.summary?.substring(0, 60)}
                          {review.summary?.length > 60 ? '...' : ''}
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <Link 
                              to={`/admin/edit/${review.id}`} 
                              className="btn btn-sm btn-outline-success"
                              title="Edit Review"
                            >
                              <AiFillEdit />
                            </Link>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteReview(review.id)}
                              title="Delete Review"
                            >
                              <FaTrashAlt />
                            </button>
                            <Link 
                              to={`/reviews/${review.id}`} 
                              className="btn btn-sm btn-outline-info"
                              title="View Review"
                              target="_blank"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        {reviews.length === 0 
                          ? "No reviews found. Create your first review!" 
                          : "No reviews match your search criteria."
                        }
                      </td>
                    </tr>
                  )}
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
