import { baseURL } from "../api_routes";

export default function Sticker({ title, subtitle, image = "" }) {
if (subtitle === "kandm") {
  subtitle = "Mouse & Keyboard Combo";
}
  return (
    <div
      className="breadcrumb-section breadcrumb-bg"
      style={{
        backgroundImage: `url(${baseURL}${image})`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 text-center">
            <div className="breadcrumb-text">
              <p>{subtitle}</p>
              <h1>{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
