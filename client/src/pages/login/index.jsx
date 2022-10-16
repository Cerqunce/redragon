import "./css/main.css";
import "./css/util.css";
import IMG from "./images/img-01.png";

export default function Login() {
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div
              className="login100-pic js-tilt"
              data-tilt=""
              style={{
                willChange: "transform",
                transform: "perspective(300px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <img src={IMG} alt="IMG" />
            </div>

            <form className="login100-form validate-form">
              <span className="login100-form-title">Admin Login</span>

              <div
                className="wrap-input100 validate-input"
                data-validate="Valid email is required: ex@abc.xyz"
              >
                <input
                  className="input100"
                  type="text"
                  name="email"
                  placeholder="Username"
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </span>
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Password is required"
              >
                <input
                  className="input100"
                  type="password"
                  name="pass"
                  placeholder="Password"
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              <div className="container-login100-form-btn">
                <button className="login100-form-btn">Login</button>
              </div>

              <div
                className="text-center p-t-12"
                style={{ visibility: "hidden" }}
              >
                <span className="txt1">Forgot</span>
                <a className="txt2" href="/">
                  Username / Password?
                </a>
              </div>

              <div
                className="text-center p-t-136"
                style={{ visibility: "hidden" }}
              >
                <a className="txt2" href="/">
                  Create your Account
                  <i
                    className="fa fa-long-arrow-right m-l-5"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <script src="vendor/jquery/jquery-3.2.1.min.js"></script>
      <script src="vendor/bootstrap/js/popper.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
      <script src="vendor/select2/select2.min.js"></script>
      <script src="vendor/tilt/tilt.jquery.min.js"></script>
      {/* <script>
        $('.js-tilt').tilt(
        {{
          scale: 1.1,
        }}
        )
      </script> */}
      <script src="js/main.js"></script>
    </>
  );
}
