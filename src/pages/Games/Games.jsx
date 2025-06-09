// Games.jsx — Complete implementation with API integration
import React, { useState, useEffect } from 'react';
import Matchcard from '../../components/Matchcard/Matchcard'; 
import './Games.scss'; 

const mockMatches = [
  { id: 1, homeTeamId: 1, awayTeamId: 2, competitionId: 1, status: 'LIVE', score: { fullTime: { home: 1, away: 0 } }, minute: '72' },
  { id: 2, homeTeamId: 3, awayTeamId: 4, competitionId: 1, status: 'FINISHED', score: { fullTime: { home: 2, away: 4 } } },
  { id: 3, homeTeamId: 1, awayTeamId: 3, competitionId: 1, status: 'SCHEDULED', score: null },
  { id: 4, homeTeamId: 2, awayTeamId: 4, competitionId: 1, status: 'LIVE', score: { fullTime: { home: 2, away: 3 } }, minute: '43' },
  { id: 5, homeTeamId: 1, awayTeamId: 4, competitionId: 1, status: 'SCHEDULED', score: null },
  { id: 6, homeTeamId: 2, awayTeamId: 3, competitionId: 1, status: 'SCHEDULED', score: null },
  { id: 7, homeTeamId: 3, awayTeamId: 1, competitionId: 1, status: 'FINISHED', score: { fullTime: { home: 1, away: 2 } } },
  { id: 8, homeTeamId: 4, awayTeamId: 2, competitionId: 1, status: 'FINISHED', score: { fullTime: { home: 2, away: 4 } } }
];

const mockTeams = [
  { id: 1, name: 'Team A', crest: '' },
  { id: 2, name: 'Team B', crest: '' },
  { id: 3, name: 'Team C', crest: '' },
  { id: 4, name: 'Team D', crest: '' }
];

const mockCompetitions = [
  { id: 1, name: 'League 🔵' },
  { id: 2, name: 'Premier League ⚽' },
  { id: 3, name: 'Champions League 🏆' }
];

function Games() {
  const [search, setSearch] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favourites, setFavourites] = useState(new Set());
  const [usingMockData, setUsingMockData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Get token from localStorage or context
  const getToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const apiCall = async (endpoint, method = 'GET', body = null) => {
    const token = getToken();
    const options = {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`http://localhost:8081${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  };

  const fetchData = async (isAutoUpdate = false) => {
    try {
      if (!isAutoUpdate) {
        setLoading(true);
        setError('');
      }

      const [matchesData, teamsData, competitionsData] = await Promise.all([
        apiCall('/xapi/matches'),
        apiCall('/xapi/teams'),
        apiCall('/xapi/competitions')
      ]);

      setMatches(matchesData || []);
      setTeams(teamsData || []);
      setCompetitions(competitionsData || []);
      setUsingMockData(false);
      setLastUpdate(new Date());

    } catch (err) {
      console.error('API error, using mock data:', err.message);
      
      if (!isAutoUpdate) {
        setError('Could not load data from server. Showing sample data.');
        setUsingMockData(true);
        
        // Use mock data as fallback
        setMatches(mockMatches);
        setTeams(mockTeams);
        setCompetitions(mockCompetitions);
        setLastUpdate(new Date());
      }
      // If it's an auto-update and fails, keep current data
    } finally {
      if (!isAutoUpdate) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-update if not using mock data and not filtering by specific league
      if (!usingMockData && selectedLeague === '') {
        console.log('Auto-refreshing matches data...');
        fetchData(true);
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [usingMockData, selectedLeague]);

  const handleFavouriteToggle = async (matchId, isFavourite) => {
    try {
      if (isFavourite) {
        await apiCall(`/api/matches/${matchId}/favourites`, 'DELETE');
        setFavourites(prev => {
          const newSet = new Set(prev);
          newSet.delete(matchId);
          return newSet;
        });
      } else {
        await apiCall(`/api/matches/${matchId}/favourites`, 'POST');
        setFavourites(prev => new Set([...prev, matchId]));
      }
    } catch (err) {
      console.error('Error toggling favourite:', err);
      // Optionally show error message to user
    }
  };

  const filteredMatches = matches.filter(match => {
    const home = teams.find(t => t.id === match.homeTeamId)?.name || '';
    const away = teams.find(t => t.id === match.awayTeamId)?.name || '';
    
    const matchesSearch = search === '' || 
      home.toLowerCase().includes(search.toLowerCase()) ||
      away.toLowerCase().includes(search.toLowerCase());
    
    const matchesLeague = selectedLeague === '' || 
      match.competitionId.toString() === selectedLeague;
    
    return matchesSearch && matchesLeague;
  });

  const handleLeagueFilter = async (competitionId) => {
    if (competitionId && competitionId !== '') {
      if (usingMockData) {
        // If using mock data, filter client-side
        const filteredMockMatches = mockMatches.filter(match => 
          match.competitionId.toString() === competitionId
        );
        setMatches(filteredMockMatches);
        return;
      }

      try {
        const leagueMatches = await apiCall(`/api/competitions/${competitionId}/matches`);
        setMatches(leagueMatches || []);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error fetching league matches:', err);
        // Fall back to client-side filtering of mock data
        const filteredMockMatches = mockMatches.filter(match => 
          match.competitionId.toString() === competitionId
        );
        setMatches(filteredMockMatches);
        setUsingMockData(true);
        setError('Could not load data from server. Showing sample data.');
      }
    } else {
      // Reload all matches when "All Leagues" is selected
      if (usingMockData) {
        // If using mock data, restore all mock matches
        setMatches(mockMatches);
        return;
      }

      try {
        const allMatches = await apiCall('/api/matches');
        setMatches(allMatches || []);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error fetching all matches:', err);
        // Restore all mock data when API fails
        setMatches(mockMatches);
        setUsingMockData(true);
        setError('Could not load data from server. Showing sample data.');
      }
    }
  };

  const handleLeagueChange = (e) => {
    const value = e.target.value;
    setSelectedLeague(value);
    handleLeagueFilter(value);
  };

  return (
    <div className="games-wp">        
        <div className="games-top">
          <h1 className="title">Matches</h1>
          <h2 className="subtitle">Find your favorite team's games!</h2>
        </div>
      <div className="games-page">

        {error && <div className="error-message">{error}</div>}
        {lastUpdate && (
          <div className="last-update">
            Last updated: {lastUpdate.toLocaleTimeString()}
            {!usingMockData && selectedLeague === '' && (
              <span className="auto-refresh-indicator"> • Auto-refresh active</span>
            )}
          </div>
        )}
        <div className="filters">
          <select
            className="league-select"
            value={selectedLeague}
            onChange={handleLeagueChange}
          >
            <option value="">All Leagues</option>
            {competitions.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Type name"
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="refresh-button"
            onClick={() => fetchData()}
            disabled={loading}
            title="Refresh data"
          >
            🔄 Refresh
          </button>
        </div>
        {loading ? (
          <div className="loading">
            <p>Loading matches...</p>
          </div>
        ) : (
          <div className="matches-grid">
            {filteredMatches.length > 0 ? (
              filteredMatches.map(match => (
                <Matchcard
                  key={match.id}
                  match={match}
                  teams={teams}
                  competitions={competitions}
                  isFavourite={favourites.has(match.id)}
                  onFavouriteToggle={handleFavouriteToggle}
                />
              ))
            ) : (
              <div className="no-matches">
                <p>No matches found. Try adjusting your search or filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Games;