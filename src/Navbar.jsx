import React, { useState } from 'react';
import './Navbar.scss';
import { Link } from 'react-router-dom'; // Używamy Link do nawigacji
import { FaHome, FaTrophy, FaStar, FaNewspaper, FaTv, FaInfoCircle, FaEnvelope, FaMoon, FaSun, FaFutbol } from 'react-icons/fa';

function Navbar() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('light-theme');
  };

  return (
    <nav className={`navbar ${isDarkTheme ? 'dark' : 'light'}`}>
      <div className="navbar-left">
        <FaFutbol className="navbar-logo" />
        <h1>ScoreTracker</h1>
      </div>

      <div className="theme-toggle">
        <span className={`theme-label ${isDarkTheme ? 'active' : ''}`}>
          <FaMoon />
        </span>
        <label className="switch">
          <input type="checkbox" checked={!isDarkTheme} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
        <span className={`theme-label ${!isDarkTheme ? 'active' : ''}`}>
          <FaSun />
        </span>
      </div>

      <div className="navbar-right">
        <Link to="/dashboard"><FaHome /> Dashboard</Link>
        <Link to="/league"><FaTrophy /> League</Link>
        <Link to="/favorites"><FaStar /> Favorites</Link>
        <Link to="/news"><FaNewspaper /> News</Link>
        <Link to="/live"><FaTv /> Live</Link>
        <Link to="/about"><FaInfoCircle /> About</Link>
        <Link to="/contact"><FaEnvelope /> Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar;