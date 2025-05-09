import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Matchcard from '../Matchcard/Matchcard';
import './DashboardTabs.scss';

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
          <label htmlFor="league">All Leagues:</label>
          <select
            id="league"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
          >
            <option value="all">All Leagues</option>
            {Array.isArray(leagues) && leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
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
          Live Matches
        </button>
        <button
          className={`tab ${activeTab === 'favourite-players' ? 'active' : ''}`}
          onClick={() => setActiveTab('favourite-players')}
        >
          Favourite players
        </button>
        <button
          className={`tab ${activeTab === 'favourite-teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('favourite-teams')}
        >
          Favourite teams
        </button>
      </div>

      {/* Zawartość zakładek */}
      <div className="tab-content">
        {activeTab === 'live' && (
          <div className="tab-pane active">
            <div className="tab-wrapper">
              <h3 className="tab-header">Live Matches</h3>
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
              <h3 className="tab-header">Favourite Players</h3>
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
              <h3 className="tab-header">Favourite Teams</h3>
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
