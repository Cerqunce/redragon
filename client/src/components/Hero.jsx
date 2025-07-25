export default function Hero({ title, subtitle, image = "" }) {

 
  return (
    <div
      className="hero-area hero-bg"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/img/wallpaper.jpg)`,
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
