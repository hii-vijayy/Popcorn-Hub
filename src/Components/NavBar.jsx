import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, actions } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = localSearchQuery.trim();
    if (query) {
      actions.search(query);
      navigate("/"); // Navigate to home page to display search results
      setLocalSearchQuery(""); // Clear search bar after submission
    }
  };

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    actions.clearSearch();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleHomeClick = () => {
    actions.clearSearch();
    navigate("/");
  };

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/movies", label: "Movies", icon: "🎬" },
    { path: "/tv-shows", label: "TV Shows", icon: "📺" },
    { path: "/trending", label: "Trending", icon: "🔥" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={handleHomeClick}>
          <img
            className="navbar__logo-icon"
            src="public/popcornhublogo.png"
            alt=""
          />
          <span className="navbar__logo-text">PopcornHub</span>
        </Link>
        {/* Search Bar */}
        <form className="navbar__search" onSubmit={handleSearchSubmit}>
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="Search movies, TV shows..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {localSearchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <button type="submit" className="search-submit" aria-label="Search">
              🔍
            </button>
          </div>
        </form>
        {/* Desktop Navigation */}
        <ul className="navbar__nav">
          {navItems.map((item) => (
            <li key={item.path} className="navbar__nav-item">
              <Link
                to={item.path}
                className={`navbar__nav-link ${
                  location.pathname === item.path
                    ? "navbar__nav-link--active"
                    : ""
                }`}
                onClick={item.path === "/" ? handleHomeClick : undefined}
              >
                <span className="navbar__nav-icon">{item.icon}</span>
                <span className="navbar__nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        {/* Mobile Menu Button */}
        <button
          className={`navbar__mobile-toggle ${
            isMobileMenuOpen ? "navbar__mobile-toggle--active" : ""
          }`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        {/* Mobile Menu */}
        <div
          className={`navbar__mobile ${
            isMobileMenuOpen ? "navbar__mobile--open" : ""
          }`}
        >
          <div className="navbar__mobile-content">
            {/* Mobile Search */}
            <form
              className="navbar__mobile-search"
              onSubmit={handleSearchSubmit}
            >
              <div className="search-input-group">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search movies, TV shows..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
                {localSearchQuery && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="submit"
                  className="search-submit"
                  aria-label="Search"
                >
                  🔍
                </button>
              </div>
            </form>
            {/* Mobile Navigation */}
            <ul className="navbar__mobile-nav">
              {navItems.map((item) => (
                <li key={item.path} className="navbar__mobile-nav-item">
                  <Link
                    to={item.path}
                    className={`navbar__mobile-nav-link ${
                      location.pathname === item.path
                        ? "navbar__mobile-nav-link--active"
                        : ""
                    }`}
                    onClick={item.path === "/" ? handleHomeClick : undefined}
                  >
                    <span className="navbar__mobile-nav-icon">{item.icon}</span>
                    <span className="navbar__mobile-nav-text">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="navbar__mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
