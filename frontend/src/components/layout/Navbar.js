import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const matchPath = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className="nav-footer">
      <ul className="navItems">
        <li
          className={matchPath("/") ? "active" : ""}
          onClick={() => navigate("/")}
        >
          <i className="fas fa-compass"></i>
          <span className="text">Pretraži</span>
        </li>
        <li
          className={matchPath("/ponude") ? "active" : "" ? "active" : ""}
          onClick={() => navigate("/ponude")}
        >
          <i className="fas fa-tag"></i>
          <span className="text">Ponude</span>
        </li>
        <li
          className={matchPath("/profil") ? "active" : "" ? "active" : ""}
          onClick={() => navigate("/profil")}
        >
          <i className="fas fa-user"></i>
          <span className="text">Profil</span>
        </li>
      </ul>
    </footer>
  );
};

export default Navbar;
