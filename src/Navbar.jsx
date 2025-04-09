import React, { useState } from 'react';
import './Navbar.scss'; 
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
        <a href="#dashboard"><FaHome /> Dashboard</a>
        <a href="#league"><FaTrophy /> League</a>
        <a href="#favorites"><FaStar /> Favorites</a>
        <a href="#news"><FaNewspaper /> News</a>
        <a href="#live"><FaTv /> Live</a>
        <a href="#about"><FaInfoCircle /> About</a>
        <a href="#contact"><FaEnvelope /> Contact</a>
      </div>
    </nav>
  );
}

export default Navbar;