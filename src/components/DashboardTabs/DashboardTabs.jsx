import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Matchcard from '../Matchcard/Matchcard';
import './DashboardTabs.scss';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const matchesData = await fetch('/api/matches').then(res => res.json());
        const teamsData = await fetch('/api/teams').then(res => res.json());
        const competitionsData = await fetch('/api/competitions').then(res => res.json());
        const preferencesData = await fetch('/api/preferences').then(res => res.json());

        setMatches(matchesData.matches);
        setTeams(teamsData.teams);
        setCompetitions(competitionsData.competitions);
        setPreferences(preferencesData.preferences[0]);
      } catch (err) {
        setError('Błąd podczas pobierania danych. Spróbuj ponownie później.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const liveMatches = matches.filter(match => match.status === 'LIVE');

  const favouritePlayersMatches = matches.filter(match => {
    const favPlayersIds = JSON.parse(preferences.favPlayersIds || '[]');
    return favPlayersIds.some(id =>
      (match.homeLineupPlayerIds || []).includes(id) ||
      (match.awayLineupPlayerIds || []).includes(id)
    );
  });

  const favouriteTeamsMatches = matches.filter(match => {
    const favTeamsIds = JSON.parse(preferences.favTeamsIds || '[]');
    return favTeamsIds.includes(match.homeTeamId) || favTeamsIds.includes(match.awayTeamId);
  });

  const renderNoMatchesMessage = () => (
    <div className="no-matches">Brak meczów do wyświetlenia</div>
  );

  const renderMatchList = (matchList) => (
    <div className="tab-wrapper">
      <div className="cards-section">
        {matchList.length > 0
          ? matchList.map((match) => (
              <Matchcard
                key={match.id}
                match={match}
                teams={teams}
                competitions={competitions}
              />
            ))
          : renderNoMatchesMessage()}
      </div>
    </div>
  );

  return (
    <div className="tabs-container">
      <div className="league-section">
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
              {competitions.map((league) => (
                <MenuItem key={league.id} value={league.id}>
                  {league.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="league-buttons">
          <button onClick={() => navigate(`/standings/${selectedLeague}`)}>Standings</button>
          <button onClick={() => navigate(`/statistics/${selectedLeague}`)}>Statistics</button>
        </div>
      </div>

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
          ⭐ Favourite Players
        </button>
        <button
          className={`tab ${activeTab === 'favourite-teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('favourite-teams')}
        >
          ⚽ Favourite Teams
        </button>
      </div>

      <div className="tab-content">
        {isLoading && <div className="loading">Ładowanie meczów...</div>}
        {error && <div className="error">{error}</div>}

        {!isLoading && activeTab === 'live' && renderMatchList(liveMatches)}
        {!isLoading && activeTab === 'favourite-players' && renderMatchList(favouritePlayersMatches)}
        {!isLoading && activeTab === 'favourite-teams' && renderMatchList(favouriteTeamsMatches)}
      </div>
    </div>
  );
};

export default DashboardTabs;
