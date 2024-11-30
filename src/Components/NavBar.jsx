import React from "react";
import "../Components/css/Navbar.css";
import logo from "../assets/popcornhublogo.png";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-content">
        <img src={logo} alt="Popcorn Hub Logo" className="PopcornHub-logo" />
        <a href="/" className='navbar-text'>POPCORN HUB</a>
      </div>
    </div>
  );
};

export default Navbar;