import React from 'react';  
import "../Components/css/Footer.css";
function Footer() {
    return (
    <>
    <hr />
        <div className="footer">
            <div className="footer-brand"><p>&copy; {new Date().getFullYear()} Movie Hub. All Rights Reserved.</p></div>
            <div className="social-links">
                <a href="https://github.com/hii-vijayy/MovieSearchApp" target="_blank" rel="noopener noreferrer">Made by Vijay Kumar | GitHub</a>
            </div>
        </div>
    </>
    );
}

export default Footer;
