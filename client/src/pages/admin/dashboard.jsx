import "./css/main.css";
import "./css/util.css";
import "./css/enhanced-admin.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { getAllReviewsRoute, VerifyRoute, baseURL } from "../../api_routes";
import { NavLink as Link, useNavigate } from "react-router-dom";
import { 
  FaPlus, 
  FaListUl, 
  FaUsers, 
  FaFileAlt, 
  FaEye, 
  FaChartBar,
  FaKeyboard,
  FaMouse,
  FaVolumeUp,
  FaDesktop
} from "react-icons/fa";
import { Card, Row, Col, Container, Badge } from "react-bootstrap";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalViews: 0,
    categoryBreakdown: {},
    recentReviews: []
  });
  const [loading, setLoading] = useState(true);

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

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getAllReviewsRoute);
        const reviews = response.data;
        
        // Calculate statistics
        const categoryBreakdown = {};
        reviews.forEach(review => {
          const category = review.type || 'uncategorized';
          categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
        });

        // Get recent reviews (last 5)
        const recentReviews = reviews
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5);

        setStats({
          totalReviews: reviews.length,
          totalViews: reviews.length * 150, // Mock view count
          categoryBreakdown,
          recentReviews
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setLoading(false);
      }
    };

    verify();
    fetchStats();
  }, [navigate]);

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'keyboard': return <FaKeyboard />;
      case 'mouse': return <FaMouse />;
      case 'speaker': return <FaVolumeUp />;
      case 'mousepad': return <FaDesktop />;
      case 'kandm': return <><FaKeyboard /><FaMouse /></>;
      default: return <FaFileAlt />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'keyboard': 'primary',
      'mouse': 'success', 
      'speaker': 'warning',
      'mousepad': 'info',
      'kandm': 'secondary'
    };
    return colors[category?.toLowerCase()] || 'dark';
  };

  if (loading) {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 add">
            <div className="text-center">
              <h3>Loading dashboard...</h3>
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
          <div className="wrap-login100 add" style={{ maxWidth: "1200px", width: "95%" }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Admin Dashboard</h2>
              <div className="d-flex gap-2">
                <Link
                  to="/admin/add"
                  className="btn btn-success"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaPlus />
                  Add Review
                </Link>
                <Link
                  to="/admin/all"
                  className="btn btn-primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaListUl />
                  All Reviews
                </Link>
              </div>
            </div>

            <Container fluid>
              {/* Stats Cards */}
              <Row className="mb-4">
                <Col md={3} className="mb-3">
                  <Card className="h-100 text-center" style={{ border: "1px solid #4158d0" }}>
                    <Card.Body>
                      <div style={{ fontSize: "2rem", color: "#4158d0", marginBottom: "0.5rem" }}>
                        <FaFileAlt />
                      </div>
                      <Card.Title>Total Reviews</Card.Title>
                      <h3 style={{ color: "#4158d0", fontWeight: "bold" }}>{stats.totalReviews}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3} className="mb-3">
                  <Card className="h-100 text-center" style={{ border: "1px solid #28a745" }}>
                    <Card.Body>
                      <div style={{ fontSize: "2rem", color: "#28a745", marginBottom: "0.5rem" }}>
                        <FaEye />
                      </div>
                      <Card.Title>Total Views</Card.Title>
                      <h3 style={{ color: "#28a745", fontWeight: "bold" }}>{stats.totalViews.toLocaleString()}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3} className="mb-3">
                  <Card className="h-100 text-center" style={{ border: "1px solid #ffc107" }}>
                    <Card.Body>
                      <div style={{ fontSize: "2rem", color: "#ffc107", marginBottom: "0.5rem" }}>
                        <FaChartBar />
                      </div>
                      <Card.Title>Categories</Card.Title>
                      <h3 style={{ color: "#ffc107", fontWeight: "bold" }}>
                        {Object.keys(stats.categoryBreakdown).length}
                      </h3>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3} className="mb-3">
                  <Card className="h-100 text-center" style={{ border: "1px solid #dc3545" }}>
                    <Card.Body>
                      <div style={{ fontSize: "2rem", color: "#dc3545", marginBottom: "0.5rem" }}>
                        <FaUsers />
                      </div>
                      <Card.Title>Avg. Rating</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">this card is not working yet</Card.Subtitle>
                      <h3 style={{ color: "#dc3545", fontWeight: "bold" }}>4.5★</h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Category Breakdown and Recent Reviews */}
              <Row>
                <Col md={6} className="mb-4">
                  <Card className="h-100">
                    <Card.Header style={{ background: "linear-gradient(-135deg, #051922, #4158d0)", color: "white" }}>
                      <h5 className="mb-0">Category Breakdown</h5>
                    </Card.Header>
                    <Card.Body>
                      {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                        <div key={category} className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex align-items-center">
                            <span style={{ marginRight: "0.5rem", fontSize: "1.2rem" }}>
                              {getCategoryIcon(category)}
                            </span>
                            <span style={{ textTransform: "capitalize" }}>{category}</span>
                          </div>
                          <Badge bg={getCategoryColor(category)}>{count}</Badge>
                        </div>
                      ))}
                      {Object.keys(stats.categoryBreakdown).length === 0 && (
                        <p className="text-muted text-center">No reviews yet</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6} className="mb-4">
                  <Card className="h-100">
                    <Card.Header style={{ background: "linear-gradient(-135deg, #051922, #4158d0)", color: "white" }}>
                      <h5 className="mb-0">Recent Reviews</h5>
                    </Card.Header>
                    <Card.Body>
                      {stats.recentReviews.map((review, index) => (
                        <div key={review.id} className="d-flex justify-content-between align-items-center mb-2 p-2" 
                             style={{ borderLeft: `3px solid #4158d0`, paddingLeft: "1rem", background: "#f8f9fa" }}>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                              {review.title?.substring(0, 30)}{review.title?.length > 30 ? '...' : ''}
                            </div>
                            <small className="text-muted">
                              {new Date(review.updatedAt).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="d-flex gap-1">
                            <Link to={`/admin/edit/${review.id}`} className="btn btn-sm btn-outline-primary">
                              Edit
                            </Link>
                            <Link to={`/reviews/${review.id}`} className="btn btn-sm btn-outline-info">
                              View
                            </Link>
                          </div>
                        </div>
                      ))}
                      {stats.recentReviews.length === 0 && (
                        <p className="text-muted text-center">No reviews yet</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Quick Actions */}
              <Row>
                <Col>
                  <Card>
                    <Card.Header style={{ background: "linear-gradient(-135deg, #051922, #4158d0)", color: "white" }}>
                      <h5 className="mb-0">Quick Actions</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex flex-wrap gap-2">
                        <Link to="/admin/add" className="btn btn-outline-success">
                          <FaPlus className="me-1" />
                          Create New Review
                        </Link>
                        <Link to="/admin/all" className="btn btn-outline-primary">
                          <FaListUl className="me-1" />
                          Manage All Reviews
                        </Link>
                        <Link to="/admin/management" className="btn btn-outline-info">
                          <FaUsers className="me-1" />
                          Manage Admins
                        </Link>
                        <Link to="/admin/gallery" className="btn btn-outline-secondary">
                          <FaListUl className="me-1" />
                          Image Gallery
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}
