import React, { useEffect, useState } from 'react';
import './Matchcard.scss'; 
import { FaHome, FaTrophy, FaStar, FaNewspaper, FaTv, FaInfoCircle, FaEnvelope, FaMoon, FaSun, FaFutbol } from 'react-icons/fa'; // Dodajemy FaFutbol

function Matchcard() {

  
    return (
      <div className="match-card">
        <div className="match-header">
          <div className="match-league">
            <span className="live-dot"></span>
            Football • placeholder
          </div>
          <div className="star">★</div>
        </div>
  
        <div className="match-body">
          <div className="team">
            <div className="team-logo"></div>
            <div className="team-name">home-team</div>
          </div>
  
          <div className="score-center">
            <div className="score">2-1</div>
            <div className="minute">12'</div>
          </div>
  
          <div className="team">
            <div className="team-logo"></div>
            <div className="team-name">away-team</div>
          </div>
        </div>
  
        <div className="match-footer">
          <div>Statistics</div>
          <div>Line-ups</div>
          <div className="mute">🔇</div>
        </div>
      </div>
    );
  }
export default Matchcard;