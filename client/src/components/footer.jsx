export default function Footer() {
  return (
    <div className="footer-area">
      <div className="container">
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col-lg-3 col-md-6">
            <div className="footer-box about-widget">
              <h2 className="widget-title">About us</h2>
              <p style={{ textAlign: "justify" }}>
                Posting gaming product reviews for gaming company Redragon, Will
                be posting reviews, videos, different styles of each keyboard,
                mouse, mousepad, speakers all brought to you by Redragon!
                Discount codes and special offers will be included! Suggestions
                for redragon products are welcomed always looking for
                improvements or new ideas!
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="footer-box get-in-touch">
              <h2 className="widget-title">Get in Touch</h2>
              <ul>
                <li>34/8, East Hukupara, Gifirtok, Sadan.</li>
                <li>support@reddragon.com</li>
                <li>+212 672 407 504</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-1 col-md-6"></div>
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
