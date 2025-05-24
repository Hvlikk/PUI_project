import React, { useState, useRef, useEffect } from 'react';
import './Navbar.scss';
import { Link, useNavigate } from 'react-router-dom';
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
  FaNewspaper,
  FaUserCircle,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useTheme } from '../../ThemeContext';
import { useAuth } from '../../auth/AuthContext';

function Navbar() {
  const { isDarkTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, logout, username } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Zamknij dropdown klikając poza nim
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
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
        <Link to="/players"><FaUsers /> Players</Link>
        <Link to="/teams"><FaShieldAlt /> Teams</Link>
        <Link to="/favorites"><FaStar /> Favorites</Link>
        <Link to="/games"><FaGamepad /> Games</Link>
        <Link to="/news"><FaNewspaper /> News</Link>
        <Link to="/about"><FaInfoCircle /> About</Link>
        <Link to="/contact"><FaEnvelope /> Contact</Link>

        {!isAuthenticated ? (
            <Link to="/login"><FaSignInAlt /> Log-in</Link>
          ) : (
            <div className="profile-dropdown" ref={dropdownRef}>
              <button
                className="profile-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <FaUserCircle /> {username || 'Profile'}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                    <FaCog /> Settings
                  </Link>
                  <button onClick={handleLogout} className="logout-button">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
