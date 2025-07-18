import "./css/main.css";
import "./css/util.css";
import "./css/enhanced-admin.css";

import { useState, useEffect } from "react";
import axios from "axios";
import { VerifyRoute, baseURL } from "../../api_routes";
import { NavLink as Link, useNavigate } from "react-router-dom";
import { 
  FaUsers, 
  FaUserPlus, 
  FaTrashAlt, 
  FaEdit,
  FaHome,
  FaKey,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { Card, Row, Col, Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";

export default function AdminManagement() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

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

    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}admin/alladmins`);
        setAdmins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
        showAlert("Failed to fetch admin list", "danger");
        setLoading(false);
      }
    };

    verify();
    fetchAdmins();
  }, [navigate]);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 4000);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      showAlert("Please fill in all fields", "warning");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}admin/add`, formData);
      
      if (response.data.status) {
        showAlert("Admin added successfully!", "success");
        setShowAddModal(false);
        setFormData({ username: "", password: "" });
        
        // Refresh admin list
        const adminResponse = await axios.get(`${baseURL}admin/alladmins`);
        setAdmins(adminResponse.data);
      } else {
        showAlert("Failed to add admin: " + response.data.msg, "danger");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      showAlert("Error: " + (error.response?.data?.msg || error.message), "danger");
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    
    if (!formData.password) {
      showAlert("Please enter a new password", "warning");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}admin/update`, {
        username: selectedAdmin.username,
        password: formData.password
      });
      
      if (response.data.status) {
        showAlert("Admin password updated successfully!", "success");
        setShowEditModal(false);
        setFormData({ username: "", password: "" });
        setSelectedAdmin(null);
      } else {
        showAlert("Failed to update admin: " + response.data.msg, "danger");
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      showAlert("Error: " + (error.response?.data?.msg || error.message), "danger");
    }
  };

  const handleDeleteAdmin = async (username) => {
    if (window.confirm(`Are you sure you want to delete admin "${username}"?`)) {
      try {
        const response = await axios.post(`${baseURL}admin/delete`, { username });
        
        if (response.data.status) {
          showAlert("Admin deleted successfully!", "success");
          
          // Refresh admin list
          const adminResponse = await axios.get(`${baseURL}admin/alladmins`);
          setAdmins(adminResponse.data);
        } else {
          showAlert("Failed to delete admin: " + response.data.msg, "danger");
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        showAlert("Error: " + (error.response?.data?.msg || error.message), "danger");
      }
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({ username: admin.username, password: "" });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 add">
            <div className="text-center">
              <h3>Loading admin management...</h3>
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
          <div className="wrap-login100 add" style={{ maxWidth: "1000px", width: "95%" }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="btn btn-secondary"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <FaHome />
                  Dashboard
                </Link>
                <h2 className="mb-0">Admin Management</h2>
              </div>
              
              <Button
                variant="success"
                onClick={() => setShowAddModal(true)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FaUserPlus />
                Add Admin
              </Button>
            </div>

            {alert.show && (
              <Alert variant={alert.variant} className="mb-3">
                {alert.message}
              </Alert>
            )}

            <Container fluid>
              {/* Stats Card */}
              <Row className="mb-4">
                <Col>
                  <Card className="admin-card">
                    <Card.Header className="admin-header">
                      <div className="d-flex align-items-center">
                        <FaUsers className="me-2" />
                        <h5 className="mb-0">System Administrators ({admins.length})</h5>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="data-table">
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Username</th>
                              <th>Created Date</th>
                              <th>Last Updated</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admins.length > 0 ? (
                              admins.map((admin, index) => (
                                <tr key={admin._id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <strong>{admin.username}</strong>
                                  </td>
                                  <td>
                                    {new Date(admin.createdAt).toLocaleDateString()}
                                  </td>
                                  <td>
                                    {new Date(admin.updatedAt).toLocaleDateString()}
                                  </td>
                                  <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => openEditModal(admin)}
                                        title="Change Password"
                                      >
                                        <FaKey />
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteAdmin(admin.username)}
                                        title="Delete Admin"
                                      >
                                        <FaTrashAlt />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center text-muted">
                                  No administrators found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserPlus className="me-2" />
            Add New Administrator
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAdmin}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              <FaUserPlus className="me-2" />
              Add Admin
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaKey className="me-2" />
            Change Password - {selectedAdmin?.username}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateAdmin}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <FaKey className="me-2" />
              Update Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
