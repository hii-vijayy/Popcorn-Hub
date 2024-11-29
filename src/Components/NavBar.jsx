import React from "react";
import "../Components/css/Navbar.css";
import logo from "../assets/popcornhublogo.png";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-content">
        <img src={logo} alt="Popcorn Hub Logo" className="navbar-logo" />
        <span className="navbar-text">POPCORN HUB</span>
      </div>
    </div>
  );
};

export default Navbar;
