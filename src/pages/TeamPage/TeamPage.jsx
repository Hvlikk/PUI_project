import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import Matchcard from '../../components/Matchcard/Matchcard';
import './TeamPage.scss';

// Mock data
const mockTeamData = {
  name: 'FC Barcelona',
  tla: 'FCB',
  country: 'Spain',
  fullName: 'Futbol Club Barcelona',
  clubColors: 'Blue / Red',
  founded: '1899',
  website: 'https://www.fcbarcelona.com',
  venue: 'Camp Nou',
  address: 'C. d\'Aristides Maillol 12, 08028 Barcelona, Spain',
  imageUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png',
};

const mockMatches = [
  {
    uuid: '1',
    utcDate: '2025-06-10T18:00:00Z',
    homeTeamName: 'FC Barcelona',
    awayTeamName: 'Real Madrid',
    homeTeamUuid: '1',
    awayTeamUuid: '2',
    status: 'FINISHED',
    fullTimeScore: { home: 3, away: 2 },
    minute: null,
    compName: 'La Liga',
    compUuid: '1'
  },
  {
    uuid: '2',
    utcDate: '2025-06-15T20:00:00Z',
    homeTeamName: 'Atletico Madrid',
    awayTeamName: 'FC Barcelona',
    homeTeamUuid: '3',
    awayTeamUuid: '1',
    status: 'FINISHED',
    fullTimeScore: { home: 1, away: 1 },
    minute: null,
    compName: 'La Liga',
    compUuid: '1'
  },
  {
    uuid: '3',
    utcDate: '2025-06-20T19:00:00Z',
    homeTeamName: 'FC Barcelona',
    awayTeamName: 'Valencia CF',
    homeTeamUuid: '1',
    awayTeamUuid: '4',
    status: 'FINISHED',
    fullTimeScore: { home: 2, away: 0 },
    minute: null,
    compName: 'La Liga',
    compUuid: '1'
  },
  {
    uuid: '4',
    utcDate: '2025-06-25T21:00:00Z',
    homeTeamName: 'Sevilla FC',
    awayTeamName: 'FC Barcelona',
    homeTeamUuid: '5',
    awayTeamUuid: '1',
    status: 'FINISHED',
    fullTimeScore: { home: 0, away: 3 },
    minute: null,
    compName: 'La Liga',
    compUuid: '1'
  },
  {
    uuid: '5',
    utcDate: '2025-06-30T18:30:00Z',
    homeTeamName: 'FC Barcelona',
    awayTeamName: 'Villarreal CF',
    homeTeamUuid: '1',
    awayTeamUuid: '6',
    status: 'FINISHED',
    fullTimeScore: { home: 4, away: 1 },
    minute: null,
    compName: 'La Liga',
    compUuid: '1'
  },
];

const mockPlayers = [
  { uuid: '1', name: 'R. Lewandowski', position: 'Forward', isFavorite: false },
  { uuid: '2', name: 'Pedri', position: 'Midfielder', isFavorite: true },
  { uuid: '3', name: 'Gavi', position: 'Midfielder', isFavorite: false },
  { uuid: '4', name: 'Ter Stegen', position: 'Goalkeeper', isFavorite: true },
  { uuid: '5', name: 'Araujo', position: 'Defender', isFavorite: false },
  { uuid: '6', name: 'F. de Jong', position: 'Midfielder', isFavorite: false },
];

const mockCoaches = [
  { uuid: '7', name: 'Pep Guardiola', isCoach: true },
];

const mockCompetitions = [
  {
    uuid: '1',
    name: 'La Liga',
    code: 'PD',
    emblem: 'https://crests.football-data.org/PD.png',
    type: 'LEAGUE'
  },
  {
    uuid: '2',
    name: 'UEFA Champions League',
    code: 'CL',
    emblem: 'https://crests.football-data.org/CL.png',
    type: 'CUP'
  },
  {
    uuid: '3',
    name: 'La liga2',
    code: 'PDW',
    emblem: 'https://crests.football-data.org/PD.png',
    type: 'LEAGUE'
  },
  {
    uuid: '4',
    name: 'La liga2',
    code: 'PDW',
    emblem: 'https://crests.football-data.org/PD.png',
    type: 'LEAGUE'
  },
  {
    uuid: '5',
    name: 'La liga2',
    code: 'PDW',
    emblem: 'https://crests.football-data.org/PD.png',
    type: 'LEAGUE'
  },
];

const TeamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentMatchesLoading, setRecentMatchesLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Fetch team data
        const teamRes = await fetch(`http://localhost:8081/api/teams/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!teamRes.ok) {
          throw new Error(`API returned status ${teamRes.status}`);
        }
        
        const teamData = await teamRes.json();

        setTeam({
          name: teamData.name || 'Unknown Team',
          tla: teamData.tla || teamData.shortName || '',
          country: teamData.country || '',
          fullName: teamData.fullName || teamData.name || '',
          clubColors: teamData.clubColors || '',
          founded: teamData.founded || '',
          website: teamData.website || '',
          venue: teamData.venue || '',
          address: teamData.address || '',
          imageUrl: teamData.crest || teamData.imageUrl || null,
        });

        // Fetch competitions
        const fetchCompetitions = async () => {
          try {
            const competitionsRes = await fetch(`http://localhost:8081/api/competitions`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (competitionsRes.ok) {
              const competitionsData = await competitionsRes.json();
              setCompetitions(competitionsData.competitions || competitionsData || []);
            }
          } catch (competitionError) {
            console.warn('Could not fetch competitions:', competitionError);
            setCompetitions([]);
          }
        };

        // Fetch team matches
        const fetchMatches = async () => {
          try {
            const matchesRes = await fetch(`http://localhost:8081/api/teams/${id}/matches`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (matchesRes.ok) {
              const matchesData = await matchesRes.json();
              setMatches(matchesData.matches || matchesData || []);
            }
          } catch (matchError) {
            console.warn('Could not fetch matches:', matchError);
            setMatches([]);
          }
        };

        // Fetch players
        const fetchPlayers = async () => {
          try {
            const playersRes = await fetch(`http://localhost:8081/api/teams/${id}/players`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (playersRes.ok) {
              const playersData = await playersRes.json();
              const allMembers = playersData.squad || playersData.players || playersData || [];
              const playersOnly = allMembers.filter(member => !member.isCoach);
              const coachesOnly = allMembers.filter(member => member.isCoach);
              setPlayers(playersOnly);
              setCoaches(coachesOnly);
            }
          } catch (playerError) {
            console.warn('Could not fetch players:', playerError);
            setPlayers([]);
            setCoaches([]);
          }
        };

        await Promise.all([
          fetchCompetitions(),
          fetchMatches(),
          fetchPlayers()
        ]);

        setError('');
        setUsingMockData(false);
      } catch (err) {
        console.error('Failed to fetch team data:', err);
        setTeam(mockTeamData);
        setMatches(mockMatches);
        setPlayers(mockPlayers);
        setCoaches(mockCoaches);
        setCompetitions(mockCompetitions);
        setUsingMockData(true);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentMatches = async () => {
      setRecentMatchesLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (usingMockData) {
          setRecentMatches(mockMatches.slice(0, 5));
          return;
        }

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch basic match data
        const matchesRes = await fetch(`http://localhost:8081/api/teams/${id}/matches`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (matchesRes.ok) {
          const matchesData = await matchesRes.json();
          const last5Matches = (matchesData.matches || matchesData).slice(0, 5);

          // Fetch detailed data for each match
          const detailedMatches = await Promise.all(
            last5Matches.map(async (match) => {
              try {
                const matchDetailsRes = await fetch(`http://localhost:8081/api/matches/${match.uuid}`, {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
                return matchDetailsRes.ok ? await matchDetailsRes.json() : null;
              } catch (e) {
                console.error(`Failed to fetch match ${match.uuid}:`, e);
                return null;
              }
            })
          );

          setRecentMatches(detailedMatches.filter(match => match !== null));
        } else {
          throw new Error('Failed to fetch matches');
        }
      } catch (err) {
        console.error('Failed to fetch recent matches:', err);
        setRecentMatches(mockMatches.slice(0, 5));
      } finally {
        setRecentMatchesLoading(false);
      }
    };

    if (id) {
      fetchTeamData().then(() => fetchRecentMatches());
    } else {
      setError('No team ID provided');
      setLoading(false);
      setRecentMatchesLoading(false);
    }
  }, [id]);

  const handleToggleFavorite = async (playerId) => {
    const player = players.find(p => p.uuid === playerId);
    if (!player) return;

    if (usingMockData) {
      setPlayers(prev => prev.map(p => 
        p.uuid === playerId 
          ? { ...p, isFavorite: !p.isFavorite }
          : p
      ));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const method = player.isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:8081/api/players/${playerId}/favourites`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setPlayers(prev => prev.map(p => 
          p.uuid === playerId 
            ? { ...p, isFavorite: !p.isFavorite }
            : p
        ));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  const handleCompetitionClick = (competitionId) => {
    navigate(`/competitions/${competitionId}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'TBD';
    }
  };

  if (loading) return <div className="loading">Ładowanie...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!team) return <div className="error">Nie znaleziono danych drużyny</div>;

  return (
    <div className="team-page">
      {usingMockData && (
        <div className="mock-data-notice">
          <p>⚠️ Używane są dane testowe - nie udało się połączyć z API</p>
        </div>
      )}
      
      <div className="team-header">
        <div className="teampage-logo">
          {!team.imageUrl || imageError ? (
            <div className="image-skeleton infinite"></div>
          ) : (
            <img 
              src={team.imageUrl} 
              alt={team.name}
              onError={handleImageError}
            />
          )}
        </div>
        
        <div className="team-info">
          <h1 className="team-name">{team.name}</h1>
          
          <div className="team-details">
            <div className="detail-column">
              <div className="detail-item">
                <span className="label">TLA:</span>
                <span className="value">{team.tla || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Country:</span>
                <span className="value">{team.country || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Full name:</span>
                <span className="value">{team.fullName || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Club colors:</span>
                <span className="value">{team.clubColors || 'N/A'}</span>
              </div>
            </div>
            
            <div className="detail-column">
              <div className="detail-item">
                <span className="label">Founded in:</span>
                <span className="value">{team.founded || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Website:</span>
                <span className="value">
                  {team.website ? (
                    <a href={team.website} target="_blank" rel="noopener noreferrer">
                      {team.website}
                    </a>
                  ) : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Venue:</span>
                <span className="value">{team.venue || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Address:</span>
                <span className="value">{team.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      
        <div className="competitions-badges">
          <h3>COMPETITIONS</h3>
          <div className="badges-container">
            {competitions.length > 0 ? (
              competitions.map((competition) => (
                <div 
                  key={competition.uuid || competition.id} 
                  className="competition-badge"
                  data-type={competition.type}
                  onClick={() => handleCompetitionClick(competition.uuid || competition.id)}
                  title={competition.name}
                >
                  <div className="badge-emblem">
                    {competition.emblem ? (
                      <img 
                        src={competition.emblem} 
                        alt={competition.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="emblem-placeholder" 
                      style={{ display: competition.emblem ? 'none' : 'flex' }}
                    >
                      {competition.code || competition.name?.substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                  <div className="badge-content">
                    <span className="badge-name">{competition.name}</span>
                    {competition.type && (
                      <span className="badge-type">{competition.type}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="badges-placeholder">
                <div className="placeholder-text">No competitions data available</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="matches-section">
        <h2>Upcoming Matches</h2>
        <div className="matches-container">
          {matches.length > 0 ? (
            matches.slice(0, 5).map((match, index) => (
              <div key={match.uuid || index} className="match-card">
                <div className="match-content">
                  <div className="match-date">
                    {match.utcDate ? formatDate(match.utcDate) : 'TBD'}
                  </div>
                  <div className="match-teams">
                    {match.homeTeam?.name || 'Home'} vs {match.awayTeam?.name || 'Away'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="match-card placeholder">
                <div className="match-placeholder">
                  <div className="placeholder-line"></div>
                  <div className="placeholder-line short"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {coaches.length > 0 && (
        <div className="coaches-section">
          <h2>Coaches</h2>
          <div className="coaches-grid">
            {coaches.map((coach) => (
              <div key={coach.uuid} className="coach-card">
                <div className="image-skeleton infinite"></div>
                <div className="coach-info">
                  <span className="coach-name">{coach.name}</span>
                  <span className="coach-role">Coach</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="team-section">
        <h2>Team</h2>
        <div className="players-grid">
          {players.length > 0 ? (
            players.map((player) => (
              <div 
                key={player.uuid} 
                className="player-card clickable"
                onClick={() => handlePlayerClick(player.uuid)}
              >
                <div className="image-skeleton infinite"></div>
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                </div>
                <button
                  className={`favorite-star ${player.isFavorite ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(player.uuid);
                  }}
                  title={player.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                  aria-label={player.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                >
                  {player.isFavorite ? '⭐' : '☆'}
                </button>
              </div>
            ))
          ) : (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="player-card placeholder">
                <div className="player-avatar">
                  <div className="image-skeleton infinite"></div>
                </div>
                <div className="player-info">
                  <div className="placeholder-line"></div>
                  <div className="placeholder-line short"></div>
                </div>
                <button className="favorite-star" disabled>☆</button>
              </div>
            ))
          )}
        </div>
        
        {players.length > 6 && (
          <div className="show-more">
            <button className="show-more-btn" type="button">
              <span>⌄</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;