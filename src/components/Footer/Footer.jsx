import React from "react";
import { Link } from "react-router-dom";  // Import Link
import './Footer.scss'

const Footer = () => {

    return (
        <footer className="footer">
                <div className="footer-wrapper">
                    <div className="content-container">                            
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/league">League</Link>
                        <Link to="/favorites">Favorites</Link>
                        <Link to="/news">News</Link>
                        <Link to="/live">Live</Link>
                    </div>
                    <div className="content-container middle">
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/tos">TOS</Link>
                        <Link to="/license">License</Link>
                        <Link to="/attributions">Attributions</Link>
                        <Link to="/faq">FAQ</Link>
                    </div>
                    <div className="content-container">
                        <p>2025 © | All rights reserved | Made with 💗 by ISK Studios</p>
                    </div>
                </div>
        </footer>
    )
};

export default Footer;