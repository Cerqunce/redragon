export default function Hero({ title, subtitle, image }) {
  // Handle different types of image sources
  const getBackgroundImage = () => {
    if (!image) {
      // Default fallback
      return `url(${process.env.PUBLIC_URL}/assets/img/wallpaper.jpg)`;
    }
    
    // If image already has url() wrapper, use as is
    if (image.startsWith('url(')) {
      return image;
    }
    
    // If it's an external URL (starts with http), wrap in url()
    if (image.startsWith('http')) {
      return `url(${image})`;
    }
    
    // If it's an uploaded image (starts with uploads/), use the server URL
    if (image.startsWith('uploads/')) {
      return `url(http://localhost:5000/api/${image})`;
    }
    
    // If it's a local path, add PUBLIC_URL and wrap in url()
    return `url(${process.env.PUBLIC_URL}/${image})`;
  };
 
  return (
    <div
      className="hero-area hero-bg"
      style={{
        backgroundImage: getBackgroundImage(),
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-9 offset-lg-2 text-center">
            <div className="hero-text">
              <div className="hero-text-tablecell">
                <p className="subtitle">{subtitle}</p>
                <h1>{title}</h1>
                {/* <div className="hero-btns">
                  <a href="shop.html" className="boxed-btn">
                    Fruit Collection
                  </a>
                  <a href="contact.html" className="bordered-btn">
                    Contact Us
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
