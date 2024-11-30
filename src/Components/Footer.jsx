import React from 'react';
import "../Components/css/Footer.css";

function Footer() {
    return (
        <>
            <hr />
            <div className="footer">
                {/* Left-Aligned Copyright Text */}
                <div className="footer-brand">
                    <p>&copy; {new Date().getFullYear()} Popcorn hub</p>
                </div>

                {/* Center-Aligned Made with Love */}
                <div className="footer-center">
                    <p>Made with 💖 by Vijay Kumar</p>
                </div>

                {/* Right-Aligned Social Links */}
                <div className="footer-socials">
                    <ul>
                        <li>
                            <a href="https://github.com/hii-vijayy" target="_blank" rel="noopener noreferrer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" />
                                <span>GitHub</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/vijay-kumar-68900b231/" target="_blank" rel="noopener noreferrer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" />
                                <span>LinkedIn</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/vijayy._kumar/" target="_blank" rel="noopener noreferrer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" />
                                <span>Instagram</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Footer;
