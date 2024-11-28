import { Link } from 'react-router-dom';

function NavBar({ clearSearch}) {
    return (
        <div className="navbar">
            {/* Navbar Brand */}
            <div className="navbar-brand">
                <a href="/" className='navbar-home-tag'>Popcorn Hub</a>
            </div>
        </div>
    );
}

export default NavBar;
