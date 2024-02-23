import logo from "./logo.png";
import { NavLink as Link } from "react-router-dom";
import { ActivePageContext } from "../context/ActivePageContext";
import { useContext } from "react";

export default function Header() {
  const { activePage } = useContext(ActivePageContext);
  console.log(activePage);
  return (
    <div
      id="sticker-sticky-wrapper"
      className="sticky-wrapper is-sticky"
      style={{ height: "105px" }}
    >
      <div
        className="top-header-area"
        id="sticker"
        style={{
          position: "fixed",
          top: "0px",
          zIndex: "inherit",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12 text-center">
              <div
                className="main-menu-wrap"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <!-- logo --> */}
                <div className="site-logo">
                  <Link to="/">
                    <img src={logo} alt="" style={{ width: "100px" }} />
                  </Link>
                </div>
                {/* <!-- logo --> */}
                {/* <!-- menu start --> */}
                <nav className="main-menu" style={{ display: "block" }}>
                  <ul>
                    <li
                      className={activePage === "home" && "current-list-item"}
                    >
                      <Link to="/">Home</Link>
                    </li>
                    <li
                      className={
                        activePage === "keyboard" && "current-list-item"
                      }
                    >
                      <Link to="/reviews?filter=keyboard">Keyboards</Link>
                    </li>
                    <li
                      className={activePage === "mouse" && "current-list-item"}
                    >
                      <Link to="/reviews?filter=mouse">Mouse</Link>
                    </li>
                    <li
                      className={
                        activePage === "headset" && "current-list-item"
                      }
                    >
                      <Link to="/reviews?filter=headset">Headset</Link>
                    </li>
                    <li
                      className={activePage === "kandm" && "current-list-item"}
                    >
                      <Link to="/reviews?filter=kandm">
                        {" "}
                        Mouse&Keyboard Combo
                      </Link>
                    </li>
                    <li
                      className={
                        activePage === "speaker" && "current-list-item"
                      }
                    >
                      <Link to="/reviews?filter=speaker">Speaker</Link>
                    </li>
                    <li
                      className={
                        activePage === "mousepad" && "current-list-item"
                      }
                    >
                      <Link to="/reviews?filter=mousepad">Mousepad</Link>
                    </li>
                    <li>
                      <a href="/">Contact Us</a>
                      <ul class="sub-menu">
                        <li>
                          <a
                            href="https://discord.com/invite/3NrZeBdhyv"
                            target={"_blank"}
                            rel="noreferrer"
                          >
                            Discord
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://redragonshop.com/pages/contact-us"
                            target={"_blank"}
                            rel="noreferrer"
                          >
                            Redragon Official Contact
                          </a>
                        </li>
                      </ul>
                    </li>

                    {/* <li>
                      <div className="header-icons">
                        <a className="shopping-cart" href="cart.html">
                          <i className="fas fa-shopping-cart"></i>
                        </a>
                        <a className="mobile-hide search-bar-icon" href="/">
                          <i className="fas fa-search"></i>
                        </a>
                      </div>
                    </li> */}
                  </ul>
                </nav>
                <a className="mobile-show search-bar-icon" href="/">
                  <i className="fas fa-search"></i>
                </a>
                <div className="mobile-menu"></div>
                {/* <!-- menu end --> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
