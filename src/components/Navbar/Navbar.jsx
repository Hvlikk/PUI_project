import React from 'react';
import './Navbar.scss';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaShieldAlt,
  FaStar,
  FaGamepad,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaMoon,
  FaSun,
  FaFutbol,
  FaNewspaper
} from 'react-icons/fa';
import { useTheme } from '../../ThemeContext';

function Navbar() {
  const { isDarkTheme, toggleTheme } = useTheme();

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
        <Link to="/players"><FaUsers /> Players</Link>
        <Link to="/teams"><FaShieldAlt /> Teams</Link>
        <Link to="/favorites"><FaStar /> Favorites</Link>
        <Link to="/games"><FaGamepad /> Games</Link>
        <Link to="/news"><FaNewspaper /> News</Link>
        <Link to="/about"><FaInfoCircle /> About</Link>
        <Link to="/contact"><FaEnvelope /> Contact</Link>
        <Link to="/login"><FaSignInAlt /> Log-in</Link>
      </div>
    </nav>
  );
}

export default Navbar;
