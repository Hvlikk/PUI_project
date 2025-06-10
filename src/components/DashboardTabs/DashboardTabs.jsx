import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Matchcard from '../Matchcard/Matchcard';
import './DashboardTabs.scss';
import { useTheme } from '../../ThemeContext';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const fallbackPlayerImage = 'https://via.placeholder.com/300x300.png?text=No+Image';
const fallbackTeamImage = 'https://via.placeholder.com/300x300.png?text=Team+Logo';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [favouritePlayers, setFavouritePlayers] = useState([]);
  const [favouriteTeams, setFavouriteTeams] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isDarkTheme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        
        // Pobierz mecze, drużyny i rozgrywki (mockowane API)
        const matchesData = await fetch('/api/matches').then(res => res.json()).catch(() => ({ matches: [] }));
        const teamsData = await fetch('/api/teams').then(res => res.json()).catch(() => ({ teams: [] }));
        const competitionsData = await fetch('/api/competitions').then(res => res.json()).catch(() => ({ competitions: [] }));

        // Pobierz ulubione z prawdziwego API
        const [favouritePlayersRes, favouriteTeamsRes] = await Promise.all([
          fetch('http://localhost:8081/api/players/favourites', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }).catch(() => null),
          fetch('http://localhost:8081/api/teams/favourites', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }).catch(() => null)
        ]);

        let favouritePlayersData = [];
        let favouriteTeamsData = [];

        if (favouritePlayersRes && favouritePlayersRes.ok) {
          favouritePlayersData = await favouritePlayersRes.json();
        }

        if (favouriteTeamsRes && favouriteTeamsRes.ok) {
          favouriteTeamsData = await favouriteTeamsRes.json();
        }

        // Mapuj dane z dodanymi właściwościami dla wyświetlania
        const mappedFavouritePlayers = favouritePlayersData
          .filter(player => !player.isCoach) // Filtruj tylko zawodników
          .map(player => ({
            id: player.uuid,
            name: player.name,
            position: 'Unknown',
            imageUrl: fallbackPlayerImage,
            isFavorite: true,
            imageLoaded: false,
          }));

        const mappedFavouriteTeams = favouriteTeamsData.map(team => ({
          id: team.uuid,
          name: team.name,
          league: 'Unknown',
          imageUrl: fallbackTeamImage,
          isFavorite: true,
          imageLoaded: false,
        }));

        setMatches(matchesData.matches || []);
        setTeams(teamsData.teams || []);
        setCompetitions(competitionsData.competitions || []);
        setFavouritePlayers(mappedFavouritePlayers);
        setFavouriteTeams(mappedFavouriteTeams);

        // Symulacja załadowania obrazków po 1 sekundzie
        setTimeout(() => {
          setFavouritePlayers(prev => prev.map(player => ({ ...player, imageLoaded: true })));
          setFavouriteTeams(prev => prev.map(team => ({ ...team, imageLoaded: true })));
        }, 1000);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Błąd podczas pobierania danych. Spróbuj ponownie później.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePlayerFavorite = async (playerId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8081/api/players/${playerId}/favourites`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`API returned status ${res.status}`);

      // Usuń z listy ulubionych
      setFavouritePlayers(prev => prev.filter(p => p.id !== playerId));
    } catch (err) {
      console.error('Failed to remove from favorites:', err);
      alert('Nie udało się usunąć z ulubionych.');
    }
  };

  const toggleTeamFavorite = async (teamId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8081/api/teams/${teamId}/favourites`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`API returned status ${res.status}`);

      // Usuń z listy ulubionych
      setFavouriteTeams(prev => prev.filter(t => t.id !== teamId));
    } catch (err) {
      console.error('Failed to remove from favorites:', err);
      alert('Nie udało się usunąć z ulubionych.');
    }
  };

  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  const liveMatches = matches.filter(match => match.status === 'LIVE');

  const favouritePlayersMatches = matches.filter(match => {
    const favPlayersIds = favouritePlayers.map(p => p.id);
    return favPlayersIds.some(id =>
      (match.homeLineupPlayerIds || []).includes(id) ||
      (match.awayLineupPlayerIds || []).includes(id)
    );
  });

  const favouriteTeamsMatches = matches.filter(match => {
    const favTeamsIds = favouriteTeams.map(t => t.id);
    return favTeamsIds.includes(match.homeTeamId) || favTeamsIds.includes(match.awayTeamId);
  });

  const renderNoMatchesMessage = () => (
    <div className="no-matches">Brak meczów do wyświetlenia</div>
  );

  const renderNoFavouritesMessage = () => {
    if (activeTab === 'favourite-players') {
      return <div className="no-matches">Brak meczów ulubionych zawodników</div>;
    }
    if (activeTab === 'favourite-teams') {
      return <div className="no-matches">Brak meczów ulubionych drużyn</div>;
    }
    return renderNoMatchesMessage();
  };

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
          : renderNoFavouritesMessage()}
      </div>
    </div>
  );

  const renderFavouritePlayers = () => (
    <div className="tab-wrapper">
      <div className="favourites-grid players-grid">
        {favouritePlayers.length === 0 ? (
          <p className="no-results">
            Brak ulubionych zawodników. Dodaj zawodników do ulubionych w sekcji Zawodnicy.
          </p>
        ) : (
          favouritePlayers.map(player => (
            <div
              key={player.id}
              className="player-item"
              onClick={() => handlePlayerClick(player.id)}
            >
              <div className="player-avatar">
                <div className="image-skeleton infinite" />
                <img
                  src={player.imageUrl}
                  alt={player.name}
                  style={{ display: player.imageLoaded ? 'block' : 'none' }}
                />
              </div>
              <span className="player-name">{player.name}</span>
              <button
                className="favorite-star favorited"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayerFavorite(player.id);
                }}
              >
                ⭐
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderFavouriteTeams = () => (
    <div className="tab-wrapper">
      <div className="favourites-grid teams-grid">
        {favouriteTeams.length === 0 ? (
          <p className="no-results">
            Brak ulubionych drużyn. Dodaj drużyny do ulubionych w sekcji Drużyny.
          </p>
        ) : (
          favouriteTeams.map(team => (
            <div
              key={team.id}
              className="team-item"
              onClick={() => handleTeamClick(team.id)}
            >
              <div className="team-avatar">
                <div className="image-skeleton infinite" />
                <img
                  src={team.imageUrl}
                  alt={team.name}
                  style={{ display: team.imageLoaded ? 'block' : 'none' }}
                />
              </div>
              <span className="team-name">{team.name}</span>
              <button
                className="favorite-star favorited"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTeamFavorite(team.id);
                }}
              >
                ⭐
              </button>
            </div>
          ))
        )}
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
        {isLoading && <div className="loading">Ładowanie danych...</div>}
        {error && <div className="error">{error}</div>}

        {!isLoading && activeTab === 'live' && renderMatchList(liveMatches)}
        {!isLoading && activeTab === 'favourite-players' && renderFavouritePlayers()}
        {!isLoading && activeTab === 'favourite-teams' && renderFavouriteTeams()}
      </div>
    </div>
  );
};

export default DashboardTabs;