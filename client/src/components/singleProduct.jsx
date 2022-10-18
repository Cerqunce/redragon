import { useEffect } from "react";
import { useState } from "react";
import { baseURL } from "../api_routes";
import Preloader from "../components/preloader";

import { NavLink as Link } from "react-router-dom";

export default function SingleProduct({ review }) {
  const [details, setDetails] = useState({
    title: "",
    content: "",
    image: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (review) {
      setDetails(review);
    }
  }, [review]);

  if (
    details.title !== "" &&
    details.content !== "" &&
    details.image !== "" &&
    details.updatedAt !== ""
  ) {
    details.image = details.image.replace("uploads\\", "uploads/");
    return (
      <>
        <div className="mt-150 mb-150">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="single-article-section">
                  <div className="single-article-text">
                    <div
                      className="single-artcile-bg"
                      style={{
                        backgroundImage: `url(${baseURL}${details.image})`,
                      }}
                    ></div>
                    <p className="blog-meta">
                      <span className="author">
                        <i className="fas fa-user"></i> Admin
                      </span>
                      <span className="date">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </p>
                    <h2>{details.title}</h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: details.content }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="sidebar-section">
                  <div className="recent-posts">
                    <h4>Recent Posts</h4>
                    <ul>
                      <li>
                        <Link to="/">
                          You will vainly look for fruit on it in autumn.
                        </Link>
                      </li>
                      <li>
                        <Link to="/">
                          A man's worth has its season, like tomato.
                        </Link>
                      </li>
                      <li>
                        <Link to="/">
                          Good thoughts bear good fresh juicy fruit.
                        </Link>
                      </li>
                      <li>
                        <Link to="/">Fall in love with the fresh orange</Link>
                      </li>
                      <li>
                        <Link to="/">
                          Why the berries always look delecious
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="tag-section">
                    <h4>Tags</h4>
                    <ul>
                      <li>
                        <Link to="/">Apple</Link>
                      </li>
                      <li>
                        <Link to="/">Strawberry</Link>
                      </li>
                      <li>
                        <Link to="/">BErry</Link>
                      </li>
                      <li>
                        <Link to="/">Orange</Link>
                      </li>
                      <li>
                        <Link to="/">Lemon</Link>
                      </li>
                      <li>
                        <Link to="/">Banana</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Preloader />;
  }
}
