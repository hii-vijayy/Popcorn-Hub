import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { name: "Home", path: "/", icon: "🏠" },
        { name: "Movies", path: "/movies", icon: "🎬" },
        { name: "TV Shows", path: "/tv-shows", icon: "📺" },
        { name: "Trending", path: "/trending", icon: "🔥" },
        { name: "Search", path: "/search", icon: "🔍" },
      ],
    },
    {
      title: "About",
      links: [
        { name: "About PopcornHub", path: "/about", icon: "ℹ️" },
        { name: "Privacy Policy", path: "/privacy", icon: "🔒" },
        { name: "Terms of Service", path: "/terms", icon: "📋" },
        { name: "Contact", path: "/contact", icon: "📧" },
      ],
    },
    {
      title: "Connect",
      links: [
        {
          name: "GitHub",
          path: "https://github.com/hii-vijayy/Popcorn-Hub",
          external: true,
          icon: "🐙",
        },
        {
          name: "Portfolio",
          path: "https://github.com/hii-vijayy",
          external: true,
          icon: "💼",
        },
        {
          name: "LinkedIn",
          path: "https://linkedin.com/in/your-profile",
          external: true,
          icon: "💼",
        },
        {
          name: "Twitter",
          path: "https://twitter.com/your-handle",
          external: true,
          icon: "🐦",
        },
      ],
    },
  ];

  const handleExternalLinkClick = (e, url) => {
    // Add analytics or tracking here if needed
    console.log(`Opening external link: ${url}`);
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container container">
        {/* Footer Main Content */}
        <div className="footer__main">
          {/* Logo and Description */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img
                className="footer-logo-img"
                src="public/popcornhublogo.png"
                alt="Popcorn Icon"
              />
              <span className="footer__logo-text">PopcornHub</span>
            </div>
            <p className="footer__description">
              Your personal gateway to discovering amazing movies and TV shows.
              Built with passion for entertainment enthusiasts worldwide.
            </p>
            <div className="footer__disclaimer">
              <p>
                <strong>Disclaimer:</strong> This is a personal project created
                for educational and portfolio purposes. All movie and TV show
                data is provided by The Movie Database (TMDb). This site is not
                affiliated with TMDb.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer__links">
            {footerLinks.map((section, index) => (
              <div key={index} className="footer__section">
                <h3 className="footer__section-title">{section.title}</h3>
                <ul className="footer__link-list" role="list">
                  {section.links.map((link, linkIndex) => (
                    <li
                      key={linkIndex}
                      className="footer__link-item"
                      role="listitem"
                    >
                      {link.external ? (
                        <a
                          href={link.path}
                          className="footer__link"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleExternalLinkClick(e, link.path)}
                          aria-label={`${link.name} (opens in new tab)`}
                        >
                          {link.icon && (
                            <span
                              className="footer__link-icon"
                              role="img"
                              aria-hidden="true"
                            >
                              {link.icon}
                            </span>
                          )}
                          {link.name}
                          <span className="external-icon" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="footer__link"
                          aria-label={link.name}
                        >
                          {link.icon && (
                            <span
                              className="footer__link-icon"
                              role="img"
                              aria-hidden="true"
                            >
                              {link.icon}
                            </span>
                          )}
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__credits">
            <p className="footer__tmdb-credit">
              Powered by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tmdb-link"
                aria-label="The Movie Database (opens in new tab)"
              >
                <span role="img" aria-hidden="true">
                  🎭
                </span>
                The Movie Database (TMDb)
              </a>
            </p>
            <p className="footer__copyright">
              © {currentYear} PopcornHub. A personal project by{" "}
              <a
                href="https://github.com/hii-vijayy"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__author-link"
                aria-label="Vijay Kumar's GitHub profile (opens in new tab)"
              >
                <span role="img" aria-hidden="true">
                  👨‍💻
                </span>
                Vijay Kumar
              </a>
            </p>
          </div>

          <div className="footer__tech-info">
            <p className="footer__tech-stack">
              Built with{" "}
              <span role="img" aria-label="React">
                ⚛️
              </span>{" "}
              React •{" "}
              <span role="img" aria-label="CSS">
                🎨
              </span>{" "}
              CSS •{" "}
              <span role="img" aria-label="API">
                📡
              </span>{" "}
              TMDb API
            </p>
          </div>
        </div>
      </div>

      {/* Animated Background */}
      <div className="footer__bg-animation" aria-hidden="true">
        <div className="footer__bg-circle footer__bg-circle--1"></div>
        <div className="footer__bg-circle footer__bg-circle--2"></div>
        <div className="footer__bg-circle footer__bg-circle--3"></div>
      </div>
    </footer>
  );
};

export default Footer;
