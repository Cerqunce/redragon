import { NavLink as Link } from "react-router-dom";
import { baseURL } from "../api_routes";

export default function ReviewCard({ id, img, title, desc, date }) {
  // Always use the new image for this review
  const reviewImage = "/assets/img/RedragonMouse.jpg";
  // Format date to a more user-friendly format
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  return (
    <div className="col-lg-4 col-md-6">
      <div className="single-latest-news">
        <Link to={`/reviews/${id}`}>
          <div className="latest-news-bg">
            <img src={reviewImage} alt="Devourer M993 Review" className="product-img" />
          </div>
        </Link>
        <div className="news-text-box">
          <h3>
            <a href="single-news.html">{title}</a>
          </h3>
          <p className="blog-meta">
            <span className="author">
              <i className="fas fa-user"></i> RedragonReviews
            </span>
            <span className="date">
              <i className="fas fa-calendar"></i> {formattedDate}
            </span>
          </p>
          <p className="excerpt">{desc}</p>
          <Link to={`/reviews/${id}`} className="read-more-btn">
            read more <i className="fas fa-angle-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
