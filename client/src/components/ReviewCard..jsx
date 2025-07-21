import { NavLink as Link } from "react-router-dom";
import { baseURL } from "../api_routes";

export default function ReviewCard({ id, slug, img, title, desc, date }) {
  img = img.replace("uploads\\", "uploads/");
  // Format date to a more user-friendly format
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  
  // Use slug if available, otherwise fall back to id for backward compatibility
  const reviewUrl = slug ? `/reviews/${slug}` : `/reviews/${id}`;
  
  return (
    <div className="col-lg-4 col-md-6">
      <div className="single-latest-news">
        <Link to={reviewUrl}>
          <div className="latest-news-bg">
            <img src={`${baseURL}${img}`} className="product-img" />
          </div>
        </Link>
        <div className="news-text-box">
          <h3>{title}</h3>
          <p className="blog-meta">
            <span className="author">
              <i className="fas fa-user"></i> RedragonReviews
            </span>
            <span className="date">
              <i className="fas fa-calendar"></i> {formattedDate}
            </span>
          </p>
          <p className="excerpt">{desc}</p>
          <Link to={reviewUrl} className="read-more-btn">
            read more <i className="fas fa-angle-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
