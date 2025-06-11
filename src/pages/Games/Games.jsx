
// Games.jsx — Enhanced implementation with detailed match data
import React, { useState, useEffect } from 'react';
import Matchcard from '../../components/Matchcard/Matchcard'; 
import './Games.scss'; 

// Mock data updated to match backend format
const mockMatches = [
  { 
    uuid: '550e8400-e29b-41d4-a716-446655440001', 
    homeTeamUuid: '550e8400-e29b-41d4-a716-446655440011',
    homeTeamName: 'Team A',
    homeTeamCrest: '',
    awayTeamUuid: '550e8400-e29b-41d4-a716-446655440012', 
    awayTeamName: 'Team B',
    awayTeamCrest: '',
    fullTimeScore: { home: 1, away: 0 },
    halfTimeScore: { home: 0, away: 0 },
    utcDate: new Date().toISOString(),
    status: 'LIVE',
    minute: '72',
    compName: 'Premier League',
    compUuid: '550e8400-e29b-41d4-a716-446655440021',
    compEmblem: ''
  },
  { 
    uuid: '550e8400-e29b-41d4-a716-446655440002', 
    homeTeamUuid: '550e8400-e29b-41d4-a716-446655440013',
    homeTeamName: 'Team C',
    homeTeamCrest: '',
    awayTeamUuid: '550e8400-e29b-41d4-a716-446655440014',
    awayTeamName: 'Team D',
    awayTeamCrest: '',
    fullTimeScore: { home: 2, away: 4 },
    halfTimeScore: { home: 1, away: 2 },
    utcDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'FINISHED',
    compName: 'Champions League',
    compUuid: '550e8400-e29b-41d4-a716-446655440022',
    compEmblem: ''
  }
];

const mockTeams = [
  { uuid: '550e8400-e29b-41d4-a716-446655440011', name: 'Team A', crest: '' },
  { uuid: '550e8400-e29b-41d4-a716-446655440012', name: 'Team B', crest: '' },
  { uuid: '550e8400-e29b-41d4-a716-446655440013', name: 'Team C', crest: '' },
  { uuid: '550e8400-e29b-41d4-a716-446655440014', name: 'Team D', crest: '' }
];

const mockCompetitions = [
  { uuid: '550e8400-e29b-41d4-a716-446655440021', name: 'Premier League ⚽' },
  { uuid: '550e8400-e29b-41d4-a716-446655440022', name: 'Champions League 🏆' },
  { uuid: '550e8400-e29b-41d4-a716-446655440023', name: 'Liga 1 🔵' }
];

function Games() {
  const [search, setSearch] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [matches, setMatches] = useState([]);
  const [detailedMatches, setDetailedMatches] = useState([]); // Enhanced matches with full details
  const [teams, setTeams] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
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

  const fetchFavourites = async () => {
    try {
      const favouriteMatches = await apiCall('/api/matches/favourites');
      const favouriteIds = new Set(favouriteMatches.map(match => match.uuid));
      setFavourites(favouriteIds);
    } catch (err) {
      console.error('Error fetching favourites:', err);
    }
  };

  // Fetch detailed information for each match
  const enrichMatchesWithDetails = async (basicMatches) => {
    if (usingMockData) {
      return basicMatches; // Mock data already has full details
    }

    setLoadingDetails(true);
    const enrichedMatches = [];

    try {
      // Process matches in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < basicMatches.length; i += batchSize) {
        const batch = basicMatches.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (basicMatch) => {
          try {
            // Fetch detailed match information
            const detailedMatch = await apiCall(`/api/matches/${basicMatch.uuid}`);
            
            return {
              ...basicMatch,
              ...detailedMatch,
              // Ensure we have team crests and competition info
              homeTeamCrest: detailedMatch.homeTeamCrest || '',
              awayTeamCrest: detailedMatch.awayTeamCrest || '',
              compName: detailedMatch.compName || '',
              compUuid: detailedMatch.compUuid || '',
              compEmblem: detailedMatch.compEmblem || ''
            };
          } catch (err) {
            console.error(`Error fetching details for match ${basicMatch.uuid}:`, err);
            // Return basic match data if detailed fetch fails
            return {
              ...basicMatch,
              homeTeamCrest: '',
              awayTeamCrest: '',
              compName: 'Unknown Competition',
              compUuid: '',
              compEmblem: ''
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        enrichedMatches.push(...batchResults);
        
        // Small delay between batches to be nice to the API
        if (i + batchSize < basicMatches.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (err) {
      console.error('Error enriching matches:', err);
      // Return basic matches if enrichment fails
      return basicMatches.map(match => ({
        ...match,
        homeTeamCrest: '',
        awayTeamCrest: '',
        compName: 'Unknown Competition',
        compUuid: '',
        compEmblem: ''
      }));
    } finally {
      setLoadingDetails(false);
    }

    return enrichedMatches;
  };

  const fetchData = async (isAutoUpdate = false) => {
    try {
      if (!isAutoUpdate) {
        setLoading(true);
        setError('');
      }

      const [matchesData, teamsData, competitionsData] = await Promise.all([
        apiCall('/api/matches'),
        apiCall('/api/teams'),
        apiCall('/api/competitions')
      ]);

      setMatches(matchesData || []);
      setTeams(teamsData || []);
      setCompetitions(competitionsData || []);
      setUsingMockData(false);
      setLastUpdate(new Date());

      // Enrich matches with detailed information
      const enrichedMatches = await enrichMatchesWithDetails(matchesData || []);
      setDetailedMatches(enrichedMatches);

      // Fetch favourites after getting matches
      await fetchFavourites();

    } catch (err) {
      console.error('API error, using mock data:', err.message);
      
      if (!isAutoUpdate) {
        setError('Could not load data from server. Showing sample data.');
        setUsingMockData(true);
        
        // Use mock data as fallback
        setMatches(mockMatches);
        setDetailedMatches(mockMatches); // Mock data already has details
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

  const handleFavouriteToggle = async (matchUuid, isFavourite) => {
    try {
      if (isFavourite) {
        await apiCall(`/api/matches/${matchUuid}/favourites`, 'DELETE');
        setFavourites(prev => {
          const newSet = new Set(prev);
          newSet.delete(matchUuid);
          return newSet;
        });
      } else {
        await apiCall(`/api/matches/${matchUuid}/favourites`, 'POST');
        setFavourites(prev => new Set([...prev, matchUuid]));
      }
    } catch (err) {
      console.error('Error toggling favourite:', err);
      // Optionally show error message to user
    }
  };

  const filteredMatches = detailedMatches.filter(match => {
    const home = match.homeTeamName || '';
    const away = match.awayTeamName || '';
    
    const matchesSearch = search === '' || 
      home.toLowerCase().includes(search.toLowerCase()) ||
      away.toLowerCase().includes(search.toLowerCase());
    
    // Now we can filter by competition since we have detailed match data
    const matchesLeague = selectedLeague === '' || match.compUuid === selectedLeague;
    
    return matchesSearch && matchesLeague;
  });

 const handleLeagueFilter = async (competitionUuid) => {
  if (competitionUuid && competitionUuid !== '') {
    if (usingMockData) {
      // For mock data, just filter client-side
      const filtered = mockMatches.filter(match => match.compUuid === competitionUuid);
      setDetailedMatches(filtered);
      return;
    }

    try {
      // ZMIANA: Używamy istniejącego endpointu z parametrem competitionId
      const leagueMatches = await apiCall(`/api/matches?competitionId=${competitionUuid}`);
      const enrichedMatches = await enrichMatchesWithDetails(leagueMatches || []);
      setMatches(leagueMatches || []);
      setDetailedMatches(enrichedMatches);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching league matches:', err);
      // Fall back to all matches and filter client-side
      try {
        const allMatches = await apiCall('/api/matches');
        const enrichedMatches = await enrichMatchesWithDetails(allMatches || []);
        const filtered = enrichedMatches.filter(match => match.compUuid === competitionUuid);
        setMatches(filtered);
        setDetailedMatches(filtered);
        setError('Filtered matches client-side due to server error.');
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
        setError('Could not filter by league. Showing all matches.');
      }
    }
  } else {
    // Reload all matches when "All Leagues" is selected
    if (usingMockData) {
      setDetailedMatches(mockMatches);
      setMatches(mockMatches);
      return;
    }

    try {
      const allMatches = await apiCall('/api/matches');
      const enrichedMatches = await enrichMatchesWithDetails(allMatches || []);
      setMatches(allMatches || []);
      setDetailedMatches(enrichedMatches);
      setLastUpdate(new Date());
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching all matches:', err);
      setMatches(mockMatches);
      setDetailedMatches(mockMatches);
      setUsingMockData(true);
      setError('Could not load data from server. Showing sample data.');
    }
  }
};

  const handleLeagueChange = (e) => {
    const value = e.target.value;
    setSelectedLeague(value);
    
    // If we already have detailed matches, just filter client-side for better UX
    if (value === '') {
      // Show all matches we currently have
      return;
    }
    
    // For specific league, we might want to fetch fresh data
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
            {loadingDetails && (
              <span className="loading-details"> • Loading match details...</span>
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
              <option key={c.uuid} value={c.uuid}>{c.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Type team name"
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="refresh-button"
            onClick={() => fetchData()}
            disabled={loading || loadingDetails}
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
                  key={match.uuid}
                  match={match}
                  teams={teams}
                  competitions={competitions}
                  isFavourite={favourites.has(match.uuid)}
                  onFavouriteToggle={handleFavouriteToggle}
                />
              ))
            ) : (
              <div className="no-matches">
                <p>No matches found. Try adjusting your search or filter.</p>
                {loadingDetails && <p>Still loading match details...</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Games;