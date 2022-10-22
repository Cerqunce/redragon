import { useState } from "react";

export default function Footer() {
  const [isHoverDiscord, setIsHoverDiscord] = useState(false);
  const [isHoverContact, setIsHoverContact] = useState(false);

  const handleMouseEnter = (type) => {
    if (type === "discord") {
      setIsHoverDiscord(true);
    }
    if (type === "contact") {
      setIsHoverContact(true);
    }
  };

  const handleMouseLeave = (type) => {
    if (type === "discord") {
      setIsHoverDiscord(false);
    }
    if (type === "contact") {
      setIsHoverContact(false);
    }
  };

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
                <li>
                  <a
                    href="https://discord.com/invite/3NrZeBdhyv"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => handleMouseEnter("discord")}
                    onMouseLeave={() => handleMouseLeave("discord")}
                    style={{
                      color: isHoverDiscord ? "#7289da" : "white",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Join on discord for support, giveaways, and much more
                  </a>
                </li>
                <li>
                  <a
                    href="https://redragonshop.com/pages/contact-us"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => handleMouseEnter("contact")}
                    onMouseLeave={() => handleMouseLeave("contact")}
                    style={{
                      color: isHoverContact ? "#7289da" : "white",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Redragon Contact Us Page
                  </a>
                </li>
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
