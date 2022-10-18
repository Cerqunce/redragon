export default function Footer() {
  return (
    <div className="footer-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="footer-box about-widget">
              <h2 className="widget-title">About us</h2>
              <p>
                Ut enim ad minim veniam perspiciatis unde omnis iste natus error
                sit voluptatem accusantium doloremque laudantium, totam rem
                aperiam, eaque ipsa quae.
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="footer-box get-in-touch">
              <h2 className="widget-title">Get in Touch</h2>
              <ul>
                <li>34/8, East Hukupara, Gifirtok, Sadan.</li>
                <li>support@fruitkha.com</li>
                <li>+00 111 222 3333</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6"></div>
          <div className="col-lg-3 col-md-6">
            <div className="footer-box subscribe">
              <h2 className="widget-title">Subscribe</h2>
              <p>Subscribe to our mailing list to get the latest updates.</p>
              <form action="index.html">
                <input type="email" placeholder="Email" />
                <button type="submit">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
