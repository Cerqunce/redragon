export default function Sticker({ title, subtitle }) {
  return (
    <div className="breadcrumb-section breadcrumb-bg">
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
