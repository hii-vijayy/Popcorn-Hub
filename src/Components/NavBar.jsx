import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const handleLogoClick = () => {
    if (window.location.pathname === "/home") {
      window.location.reload();
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar-inner">
        <Link
          to="/home"
          onClick={handleLogoClick}
          className="navbar-logo-link"
          style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src="popcornhublogo.png" alt="Logo" className="navbar-logo-icon" />
          <span className="navbar-title">POPCORN HUB</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
