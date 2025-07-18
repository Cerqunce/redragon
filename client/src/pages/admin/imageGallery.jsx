import "./css/main.css";
import "./css/util.css";
import "./css/enhanced-admin.css";

import { useState, useEffect } from "react";
import axios from "axios";
import { VerifyRoute, baseURL } from "../../api_routes";
import { NavLink as Link, useNavigate } from "react-router-dom";
import { 
  FaImages, 
  FaTrashAlt, 
  FaDownload,
  FaHome,
  FaSearch,
  FaCopy,
  FaEye
} from "react-icons/fa";
import { Card, Row, Col, Container, Button, Modal, Form, Alert, InputGroup } from "react-bootstrap";

export default function ImageGallery() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  // Get the base server URL without the /api/ part
  const serverBaseURL = baseURL.replace('/api/', '');
  const defaultImageURL = '/assets/img/RedragonMouse.jpg';

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

    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}admin/images`);
        setImages(response.data);
        setFilteredImages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch images:", error);
        showAlert("Failed to fetch image gallery", "danger");
        setLoading(false);
      }
    };

    verify();
    fetchImages();
  }, [navigate]);

  // Filter images based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = images.filter(image =>
        image.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.originalname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  }, [searchTerm, images]);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 4000);
  };

  const copyImageUrl = (imageUrl) => {
    navigator.clipboard.writeText(imageUrl);
    showAlert("Image URL copied to clipboard!", "success");
  };

  const getImageUrl = (filename) => {
    return `${baseURL}uploads/${filename}`;
  };

  const handleImageError = (e, filename) => {
    const imageKey = filename;
    
    // Prevent infinite loops by checking if this image has already failed
    if (!failedImages.has(imageKey)) {
      setFailedImages(prev => new Set(prev).add(imageKey));
      e.target.src = defaultImageURL;
      console.warn(`Failed to load image: ${filename}, using fallback`);
    } else {
      // If even the default failed, hide the image
      e.target.style.display = 'none';
      console.error(`Fallback image also failed for: ${filename}`);
    }
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const token = sessionStorage.getItem("token");
        await axios.delete(`${baseURL}admin/images/${imageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const newImages = images.filter(img => img.id !== imageId);
        setImages(newImages);
        showAlert("Image deleted successfully!", "success");
      } catch (error) {
        console.error("Failed to delete image:", error);
        showAlert("Failed to delete image", "danger");
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 add">
            <div className="text-center">
              <h3>Loading image gallery...</h3>
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
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="btn btn-secondary"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <FaHome />
                  Dashboard
                </Link>
                <h2 className="mb-0">Image Gallery</h2>
              </div>
            </div>

            {alert.show && (
              <Alert variant={alert.variant} className="mb-3">
                {alert.message}
              </Alert>
            )}

            {/* Search */}
            <Row className="mb-4">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search images by filename..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="text-end">
                <span className="text-muted">
                  Showing {filteredImages.length} of {images.length} images
                </span>
              </Col>
            </Row>

            <Container fluid>
              <Row>
                {filteredImages.length > 0 ? (
                  filteredImages.map((image) => (
                    <Col md={4} lg={3} className="mb-4" key={image.filename}>
                      <Card className="h-100 image-card">
                        <div 
                          className="image-preview"
                          style={{ 
                            height: "200px", 
                            overflow: "hidden",
                            cursor: "pointer",
                            position: "relative"
                          }}
                          onClick={() => openImageModal(image)}
                        >
                          <Card.Img 
                            variant="top" 
                            src={getImageUrl(image.filename)}
                            alt={`Image: ${image.filename}`}
                            style={{ 
                              width: "100%", 
                              height: "100%", 
                              objectFit: "cover" 
                            }}
                            onError={(e) => handleImageError(e, image.filename)}
                          />
                          <div className="image-overlay">
                            <FaEye size={24} color="white" />
                          </div>
                        </div>
                        <Card.Body className="p-2">
                          <Card.Title style={{ fontSize: "0.9rem" }}>
                            {image.originalname || image.filename}
                          </Card.Title>
                          <div className="image-info">
                            <small className="text-muted d-block">
                              Size: {formatFileSize(image.size || 0)}
                            </small>
                            <small className="text-muted d-block">
                              Uploaded: {new Date(image.uploadDate || Date.now()).toLocaleDateString()}
                            </small>
                          </div>
                        </Card.Body>
                        <Card.Footer className="p-2">
                          <div className="d-flex gap-1 justify-content-center">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => copyImageUrl(getImageUrl(image.filename))}
                              title="Copy URL"
                            >
                              <FaCopy />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => downloadImage(
                                getImageUrl(image.filename),
                                image.originalname || image.filename
                              )}
                              title="Download"
                            >
                              <FaDownload />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteImage(image.id)}
                              title="Delete"
                            >
                              <FaTrashAlt />
                            </Button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <div className="text-center py-5">
                      <FaImages size={64} className="text-muted mb-3" />
                      <h4 className="text-muted">No images found</h4>
                      <p className="text-muted">
                        {searchTerm 
                          ? "Try adjusting your search terms"
                          : "Upload some images through the review editor to see them here"
                        }
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
            </Container>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedImage?.originalname || selectedImage?.filename}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage && (
            <>
              <img 
                src={getImageUrl(selectedImage.filename)}
                alt={selectedImage.originalname}
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "500px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}
                onError={(e) => handleImageError(e, selectedImage.filename)}
              />
              <div className="mt-3">
                <p><strong>Filename:</strong> {selectedImage.filename}</p>
                <p><strong>Size:</strong> {formatFileSize(selectedImage.size || 0)}</p>
                <p><strong>URL:</strong></p>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    value={getImageUrl(selectedImage.filename)}
                    readOnly
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => copyImageUrl(getImageUrl(selectedImage.filename))}
                  >
                    <FaCopy />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => downloadImage(
              getImageUrl(selectedImage?.filename),
              selectedImage?.originalname || selectedImage?.filename
            )}
          >
            <FaDownload className="me-2" />
            Download
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .image-card {
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .image-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .image-preview {
          position: relative;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .image-preview:hover .image-overlay {
          opacity: 1;
        }
      `}</style>
    </>
  );
}
