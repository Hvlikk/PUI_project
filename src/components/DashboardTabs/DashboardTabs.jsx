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
        
        // Pobierz podstawowe dane
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [matchesRes, teamsRes, competitionsRes] = await Promise.all([
          fetch('http://localhost:8081/api/matches', { method: 'GET', headers }).catch(() => null),
          fetch('http://localhost:8081/api/teams', { method: 'GET', headers }).catch(() => null),
          fetch('http://localhost:8081/api/competitions', { method: 'GET', headers }).catch(() => null),
        ]);

        
        const rawMatchesData = await matchesRes.json();
        const teamsData = await teamsRes.json();
        const competitionsData = await competitionsRes.json();
        const detailedMatchesData = await Promise.all(
          rawMatchesData.map(async (match) => {
            try {
              const matchDetailsRes = await fetch(`http://localhost:8081/api/matches/${match.uuid}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (matchDetailsRes.ok) {
                const matchDetails = await matchDetailsRes.json();
                return matchDetails;
              } else {
                return match; // fallback na podstawowy obiekt
              }
            } catch (error) {
              console.error(`Error fetching match details for ${match.uuid}:`, error);
              return match;
            }
          })
        );

        // Pobierz ulubione zawodniki i drużyny
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

        // Pobierz szczegółowe informacje o ulubionych drużynach i ich rozgrywkach
        const detailedFavouriteTeams = await Promise.all(
          favouriteTeamsData.map(async (team) => {
            try {
              // Pobierz szczegóły drużyny
              const teamDetailsRes = await fetch(`http://localhost:8081/api/teams/${team.uuid}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              let teamDetails = team;
              if (teamDetailsRes.ok) {
                teamDetails = await teamDetailsRes.json();
              }

              console.log(detailedMatchesData); // tu jet UUID meczu
              // Znajdź mecze tej drużyny aby określić w jakich rozgrywkach gra
              const teamMatches = detailedMatchesData.filter(match => 
                match.homeTeamUuid === team.uuid || match.awayTeamUuid === team.uuid
              );

              
              const competitionIds = [...new Set(teamMatches.map(match => match.compUuid))];

              console.log(team.name, "Competitions:", competitionIds)

              return {
                ...teamDetails,
                uuid: team.uuid,
                id: team.uuid,
                competitionIds: competitionIds,
                imageUrl: teamDetails.crest || fallbackTeamImage,
                isFavorite: true,
                imageLoaded: false,
              };
            } catch (error) {
              console.error(`Error fetching team details for ${team.uuid}:`, error);
              return {
                ...team,
                id: team.uuid,
                competitionIds: [],
                imageUrl: fallbackTeamImage,
                isFavorite: true,
                imageLoaded: false,
              };
            }
          })
        );

        // Pobierz szczegółowe informacje o ulubionych zawodnikach
        const detailedFavouritePlayers = await Promise.all(
          favouritePlayersData
            .filter(player => !player.isCoach)
            .map(async (player) => {
              try {
                // Pobierz szczegóły zawodnika
                const playerDetailsRes = await fetch(`http://localhost:8081/api/players/${player.uuid}`, {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
                
                let playerDetails = player;
                if (playerDetailsRes.ok) {
                  playerDetails = await playerDetailsRes.json();
                }

                // Znajdź drużynę zawodnika wśród ulubionych drużyn
                const playerTeam = detailedFavouriteTeams.find(team => 
                  team.name === playerDetails.teamName
                );

                return {
                  id: player.uuid,
                  uuid: player.uuid,
                  name: playerDetails.name || player.name,
                  firstName: playerDetails.firstName,
                  lastName: playerDetails.lastName,
                  position: playerDetails.position || 'Unknown',
                  teamName: playerDetails.teamName,
                  teamId: playerTeam?.uuid,
                  competitionIds: playerTeam?.competitionIds || [],
                  imageUrl: fallbackPlayerImage,
                  isFavorite: true,
                  imageLoaded: false,
                };
              } catch (error) {
                console.error(`Error fetching player details for ${player.uuid}:`, error);
                return {
                  id: player.uuid,
                  uuid: player.uuid,
                  name: player.name,
                  position: 'Unknown',
                  teamName: '',
                  competitionIds: [],
                  imageUrl: fallbackPlayerImage,
                  isFavorite: true,
                  imageLoaded: false,
                };
              }
            })
        );

        setMatches(detailedMatchesData);
        setTeams(teamsData);
        setCompetitions(competitionsData);
        setFavouritePlayers(detailedFavouritePlayers);
        setFavouriteTeams(detailedFavouriteTeams);

        // Symulacja załadowania obrazków po 1 sekundzie
        setTimeout(() => {
          setFavouritePlayers(prev => prev.map(player => ({ ...player, imageLoaded: true })));
          setFavouriteTeams(prev => prev.map(team => ({ ...team, imageLoaded: true })));
        }, 1000);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Funkcja do filtrowania zawodników po lidze
  const filterPlayersByLeague = (playerList) => {
    if (selectedLeague === 'all') {
      return playerList;
    }
    
    return playerList.filter(player => {
      return player.competitionIds && player.competitionIds.includes(selectedLeague);
    });
  };

  // Funkcja do filtrowania drużyn po lidze
  const filterTeamsByLeague = (teamList) => {
    if (selectedLeague === 'all') {
      return teamList;
    }
    
    return teamList.filter(team => {
      return team.competitionIds && team.competitionIds.includes(selectedLeague);
    });
  };

  // Funkcja do filtrowania meczów po lidze
  const filterMatchesByLeague = (matchList) => {
    if (selectedLeague === 'all') {
      return matchList;
    }
    
    return matchList.filter(match => match.compUuid === selectedLeague);
  };

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
      alert('Failed to remove from favorites.');
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
      alert('Failed to remove from favorites.');
    }
  };

  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  // Filtrowanie meczów z uwzględnieniem wybranej ligi
  const liveMatches = filterMatchesByLeague(matches.filter(match => match.status === 'LIVE'));

  const favouritePlayersMatches = filterMatchesByLeague(matches.filter(match => {
    const favPlayersIds = favouritePlayers.map(p => p.id);
    return favPlayersIds.some(id =>
      (match.homeLineupPlayerIds || []).includes(id) ||
      (match.awayLineupPlayerIds || []).includes(id)
    );
  }));

  const favouriteTeamsMatches = filterMatchesByLeague(matches.filter(match => {
    const favTeamsIds = favouriteTeams.map(t => t.uuid || t.id);
    return favTeamsIds.includes(match.homeTeamUuid) || favTeamsIds.includes(match.awayTeamUuid);
  }));

  // Filtrowanie ulubionych zawodników i drużyn po lidze
  const filteredFavouritePlayers = filterPlayersByLeague(favouritePlayers);
  const filteredFavouriteTeams = filterTeamsByLeague(favouriteTeams);

  const renderNoMatchesMessage = () => (
    <div className="no-matches">No matches to display</div>
  );

  const renderNoFavouritesMessage = () => {
    if (activeTab === 'favourite-players') {
      return <div className="no-matches">No matches with favorite players</div>;
    }
    if (activeTab === 'favourite-teams') {
      return <div className="no-matches">No matches with favorite teams</div>;
    }
    return renderNoMatchesMessage();
  };

  const renderMatchList = (matchList) => (
    <div className="tab-wrapper">
      <div className="cards-section">
        {matchList.length > 0
          ? matchList.map((match) => (
              <Matchcard
                key={match.uuid || match.id}
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
        {filteredFavouritePlayers.length === 0 ? (
          <p className="no-results">
            {selectedLeague === 'all' 
              ? "No favorite players. Add players to favorites in the Players section."
              : "No favorite players in selected league."
            }
          </p>
        ) : (
          filteredFavouritePlayers.map(player => (
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
              <div className="player-info">
                <span className="player-name">{player.name}</span>
              </div>
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
        {filteredFavouriteTeams.length === 0 ? (
          <p className="no-results">
            {selectedLeague === 'all' 
              ? "No favorite teams. Add teams to favorites in the Teams section."
              : "No favorite teams in selected league."
            }
          </p>
        ) : (
          filteredFavouriteTeams.map(team => (
            <div
              key={team.uuid || team.id}
              className="team-item"
              onClick={() => handleTeamClick(team.uuid || team.id)}
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
                  toggleTeamFavorite(team.uuid || team.id);
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
                <MenuItem key={league.uuid || league.id} value={league.uuid || league.id}>
                  {league.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        {isLoading && <div className="loading">Loading data...</div>}
        {error && <div className="error">{error}</div>}

        {!isLoading && activeTab === 'live' && renderMatchList(liveMatches)}
        {!isLoading && activeTab === 'favourite-players' && renderFavouritePlayers()}
        {!isLoading && activeTab === 'favourite-teams' && renderFavouriteTeams()}
      </div>
    </div>
  );
};

export default DashboardTabs;