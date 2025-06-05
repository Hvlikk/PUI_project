import React, { useState, useEffect } from 'react';
import Matchcard from '../../components/Matchcard/Matchcard'; 
import './Games.scss'; 

// Mock dane — zostaną użyte tylko jeśli API nie zadziała
const mockMatches = [
  {
    id: 1,
    homeTeamId: 1,
    awayTeamId: 2,
    competitionId: 1,
    status: 'LIVE',
    score: { fullTime: { home: 1, away: 0 } },
    minute: '72',
  },
  {
    id: 2,
    homeTeamId: 3,
    awayTeamId: 4,
    competitionId: 1,
    status: 'FINISHED',
    score: { fullTime: { home: 2, away: 4 } },
  },
  {
    id: 3,
    homeTeamId: 1,
    awayTeamId: 3,
    competitionId: 1,
    status: 'SCHEDULED',
    score: null,
  }
];

const mockTeams = [
  { id: 1, name: 'Team A', crest: '' },
  { id: 2, name: 'Team B', crest: '' },
  { id: 3, name: 'Team C', crest: '' },
  { id: 4, name: 'Team D', crest: '' }
];

const mockCompetitions = [
  { id: 1, name: 'League 🔵' }
];

function Games() {
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState(mockMatches);
  const [teams, setTeams] = useState(mockTeams);
  const [competitions, setCompetitions] = useState(mockCompetitions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, teamsRes, competitionsRes] = await Promise.all([
          fetch('http://localhost:8081/api/matches'),
          fetch('http://localhost:8081/api/teams'),
          fetch('http://localhost:8081/api/competitions'),
        ]);

        if (!matchesRes.ok || !teamsRes.ok || !competitionsRes.ok) {
          throw new Error('API returned error status');
        }

        const [matchesData, teamsData, competitionsData] = await Promise.all([
          matchesRes.json(),
          teamsRes.json(),
          competitionsRes.json()
        ]);

        setMatches(matchesData);
        setTeams(teamsData);
        setCompetitions(competitionsData);
      } catch (err) {
        console.error('API error, using mock data:', err.message);
        setError('Could not load data from server. Showing temporary data.');
        // Dane mock są już w stanie – nic więcej nie trzeba robić
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMatches = matches.filter(match => {
    const homeTeam = teams.find(t => t.id === match.homeTeamId)?.name || '';
    const awayTeam = teams.find(t => t.id === match.awayTeamId)?.name || '';
    return (
      homeTeam.toLowerCase().includes(search.toLowerCase()) ||
      awayTeam.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="games">
      <h1 className="title">Matches</h1>
      <p className="subtitle">Find your favorite team's games!</p>

      {error && (
        <div className="error-message" style={{ color: '#c00', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="filters">
        <select className="league-select">
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading matches...</p>
      ) : (
        <div className="matches-grid">
          {filteredMatches.map(match => (
            <Matchcard
              key={match.id}
              match={match}
              teams={teams}
              competitions={competitions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Games;
