import React from 'react';
import './Dashboard.scss';
import Matchcard from '../../components/Matchcard/Matchcard'; // Zakładamy, że masz komponent Matchcard
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function Dashboard() {
  return (
    <div className="dashboard">
        <div className="top">
            <h1>Dashboard</h1>
            <h2>Welcome to ScoreTracker. Track your favourite teams and players across the world.</h2>
        </div>
        <div className="matchcard-container">
            <Matchcard />
            <Matchcard />
            <Matchcard />
        </div>
    </div>
  );
}

export default Dashboard;