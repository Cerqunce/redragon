import { NavLink as Link } from "react-router-dom";
import { baseURL } from "../api_routes";

export default function ReviewCard({ id, img, title, desc, date }) {
  img = img.replace("uploads\\", "uploads/");
  return (
    <div className="col-lg-4 col-md-6">
      <div className="single-latest-news">
        <Link to={`/reviews/${id}`}>
          <div
            className="latest-news-bg"
            // style={{
            //   backgroundImage: `url(${baseURL}${img})`,
            // }}
          >
            <img src={`${baseURL}${img}`} alt="" className="product-img" />
          </div>
        </Link>
        <div className="news-text-box">
          <h3>
            <a href="single-news.html">{title}</a>
          </h3>
          <p className="blog-meta">
            <span className="author">
              <i className="fas fa-user"></i> Admin
            </span>
            <span className="date">
              <i className="fas fa-calendar"></i> {date}
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
