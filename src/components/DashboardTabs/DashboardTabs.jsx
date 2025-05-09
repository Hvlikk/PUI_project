import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Matchcard from '../Matchcard/Matchcard';
import './DashboardTabs.scss';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';


const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const navigate = useNavigate();

  // Pobieranie lig z API
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const res = await fetch('');
        const data = await res.json();
        // Zakładamy, że odpowiedź zawiera pole "competitions" jako tablicę lig
        setLeagues(data.competitions || []);
      } catch (error) {
        console.error('Błąd podczas pobierania lig:', error);
      }
    };

    fetchLeagues();
  }, []);

  return (
    <div className="tabs-container">
      <div className="league-section">
        {/* Wybór ligi */}
        <div className="league-selector">
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="league-label">League</InputLabel>
            <Select
              labelId="league-label"
              id="league"
              value={selectedLeague}
              label="League"
              onChange={(e) => setSelectedLeague(e.target.value)}
            >
              <MenuItem value="all">All Leagues</MenuItem>
              {Array.isArray(leagues) &&
                leagues.map((league) => (
                  <MenuItem key={league.id} value={league.id}>
                    {league.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        {/* Przyciski do statystyk i tabeli */}
        <div className="league-buttons">
          <button onClick={() => navigate(`/standings/${selectedLeague}`)}>
            Standings
          </button>
          <button onClick={() => navigate(`/statistics/${selectedLeague}`)}>
            Statistics
          </button>
        </div>
      </div>

      {/* Zakładki */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
        🔥 Live Matches
        </button>
        <button
          className={`tab ${activeTab === 'favourite-players' ? 'active' : ''}`}
          onClick={() => setActiveTab('favourite-players')}
        >
        ⭐ Favourite players
        </button>
        <button
          className={`tab ${activeTab === 'favourite-teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('favourite-teams')}
        >
        ⚽ Favourite teams
        </button>
      </div>

      {/* Zawartość zakładek */}
      <div className="tab-content">
        {activeTab === 'live' && (
          <div className="tab-pane active">
            <div className="tab-wrapper">
              <div className="cards-section">
                <Matchcard />
                <Matchcard />
                <Matchcard />
                <Matchcard />
                <Matchcard />
                <Matchcard />
                <Matchcard />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favourite-players' && (
          <div className="tab-pane active">
            <div className="tab-wrapper">
              <div className="cards-section">
                <Matchcard />
                <Matchcard />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favourite-teams' && (
          <div className="tab-pane active">
            <div className="tab-wrapper">
              <div className="cards-section">
                <Matchcard />
                <Matchcard />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTabs;
