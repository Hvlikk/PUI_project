import React from "react";
import { Link } from "react-router-dom";  // Import Link
import './Footer.scss'

const Footer = () => {

    return (
        <footer className="footer">
                <div className="footer-wrapper">
                    <div className="content-container">                            
                        <Link to="/dashboard" class="nav-link">Dashboard</Link>
                        <Link to="/players" class="nav-link">Players</Link>
                        <Link to="/teams" class="nav-link">Teams</Link>
                    </div>
                   
                    <div className="content-container">
                            <Link to="/favorites" class="nav-link">Favorites</Link>
                            <Link to="/news" class="nav-link">News</Link>
                            <Link to="/games" class="nav-link">Games</Link>
                    </div>
                   
                    <div className="content-container middle">
                        <Link to="/about" class="nav-link">About</Link>
                        <Link to="/tos" class="nav-link">TOS</Link>
                        <Link to="/privacy-policy" class="nav-link">Privacy Policy</Link>
                    </div>
                   
                    <div className="content-container">
                        <Link to="/license" class="nav-link">License</Link>
                        <Link to="/attributions" class="nav-link">Attributions</Link>
                        <Link to="/faq" class="nav-link">FAQ</Link>
                    </div>
    

                    <div className="content-container last">
                        <p className="nav-link">2025 © | All rights reserved</p>
                        <p className="nav-link"> Made with 💗 by ISK Studios</p>
                    </div>
                </div>
        </footer>
    )
};

export default Footer;