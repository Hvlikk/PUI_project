import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './TeamPage.scss';

const fallbackImage = 'https://via.placeholder.com/150x150.png?text=No+Image';

// Mock data dla przypadku gdy API nie działa
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
    id: 1,
    utcDate: '2025-06-10T18:00:00Z',
    homeTeam: { name: 'FC Barcelona' },
    awayTeam: { name: 'Real Madrid' },
  },
  {
    id: 2,
    utcDate: '2025-06-15T20:00:00Z',
    homeTeam: { name: 'Atletico Madrid' },
    awayTeam: { name: 'FC Barcelona' },
  },
  {
    id: 3,
    utcDate: '2025-06-20T19:00:00Z',
    homeTeam: { name: 'FC Barcelona' },
    awayTeam: { name: 'Valencia CF' },
  },
  {
    id: 4,
    utcDate: '2025-06-25T21:00:00Z',
    homeTeam: { name: 'Sevilla FC' },
    awayTeam: { name: 'FC Barcelona' },
  },
  {
    id: 5,
    utcDate: '2025-06-30T18:30:00Z',
    homeTeam: { name: 'FC Barcelona' },
    awayTeam: { name: 'Villarreal CF' },
  },
];

const mockPlayers = [
  {
    id: 1,
    name: 'R. Lewandowski',
    position: 'Forward',
    imageUrl: 'https://img.a.transfermarkt.technology/portrait/big/38253-1668501429.jpg?lm=1',
    isFavorite: false,
  },
  {
    id: 2,
    name: 'Pedri',
    position: 'Midfielder',
    imageUrl: 'https://img.a.transfermarkt.technology/portrait/big/401923-1689754142.jpg?lm=1',
    isFavorite: true,
  },
  {
    id: 3,
    name: 'Gavi',
    position: 'Midfielder',
    imageUrl: 'https://img.a.transfermarkt.technology/portrait/big/656241-1668501513.jpg?lm=1',
    isFavorite: false,
  },
  {
    id: 4,
    name: 'Ter Stegen',
    position: 'Goalkeeper',
    imageUrl: 'https://img.a.transfermarkt.technology/portrait/big/74857-1668501521.jpg?lm=1',
    isFavorite: true,
  },
  {
    id: 5,
    name: 'Araujo',
    position: 'Defender',
    imageUrl: 'https://img.a.transfermarkt.technology/portrait/big/480267-1668501457.jpg?lm=1',
    isFavorite: false,
  },
  {
    id: 6,
    name: 'F. de Jong',
    position: 'Midfielder',
    imageUrl: 'https://img.a.transfermarkt.technology/portrait/big/326330-1668501480.jpg?lm=1',
    isFavorite: false,
  },
];

const TeamPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Pobierz dane drużyny
        const teamRes = await fetch(`http://localhost:8081/api/teams/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!teamRes.ok) throw new Error(`API returned status ${teamRes.status}`);
        const teamData = await teamRes.json();

        setTeam({
          name: teamData.name || 'TEAM_NAME',
          tla: teamData.tla || teamData.shortName || '',
          country: teamData.country || '',
          fullName: teamData.fullName || teamData.name || '',
          clubColors: teamData.clubColors || '',
          founded: teamData.founded || '',
          website: teamData.website || '',
          venue: teamData.venue || '',
          address: teamData.address || '',
          imageUrl: teamData.crest || teamData.imageUrl || fallbackImage,
        });

        // Pobierz mecze drużyny (jeśli endpoint istnieje)
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
        }

        // Pobierz zawodników drużyny (jeśli endpoint istnieje)
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
            setPlayers(playersData.squad || playersData.players || playersData || []);
          }
        } catch (playerError) {
          console.warn('Could not fetch players:', playerError);
        }

        setError('');
      } catch (err) {
        console.error('Failed to fetch team data:', err);
        console.log('Using mock data due to API failure');
        
        // Użyj danych mockowych gdy API nie działa
        setTeam(mockTeamData);
        setMatches(mockMatches);
        setPlayers(mockPlayers);
        setUsingMockData(true);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  const handleToggleFavorite = async (playerId) => {
    // Znajdź zawodnika i sprawdź czy jest ulubiony
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    // Jeśli używamy danych mockowych, tylko aktualizuj lokalnie
    if (usingMockData) {
      setPlayers(prev => prev.map(p => 
        p.id === playerId 
          ? { ...p, isFavorite: !p.isFavorite }
          : p
      ));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = player.isFavorite ? 'DELETE' : 'POST';
      
      await fetch(`http://localhost:8081/api/players/${playerId}/favorite`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Aktualizuj stan lokalnie
      setPlayers(prev => prev.map(p => 
        p.id === playerId 
          ? { ...p, isFavorite: !p.isFavorite }
          : p
      ));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (loading) return <div className="loading">Ładowanie...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!team) return null;

  return (
    <div className="team-page">
      {usingMockData && (
        <div className="mock-data-notice">
          <p>⚠️ Używane są dane testowe - nie udało się połączyć z API</p>
        </div>
      )}
      
      <div className="team-header">
        <div className="team-logo">
          <img src={team.imageUrl} alt={team.name} />
        </div>
        
        <div className="team-info">
          <h1 className="team-name">{team.name}</h1>
          
          <div className="team-details">
            <div className="detail-column">
              <div className="detail-item">
                <span className="label">TLA:</span>
                <span className="value">{team.tla}</span>
              </div>
              <div className="detail-item">
                <span className="label">Country:</span>
                <span className="value">{team.country}</span>
              </div>
              <div className="detail-item">
                <span className="label">Full name:</span>
                <span className="value">{team.fullName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Club colors:</span>
                <span className="value">{team.clubColors}</span>
              </div>
            </div>
            
            <div className="detail-column">
              <div className="detail-item">
                <span className="label">Founded in:</span>
                <span className="value">{team.founded}</span>
              </div>
              <div className="detail-item">
                <span className="label">Website:</span>
                <span className="value">
                  {team.website ? (
                    <a href={team.website} target="_blank" rel="noopener noreferrer">
                      {team.website}
                    </a>
                  ) : ''}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Venue:</span>
                <span className="value">{team.venue}</span>
              </div>
              <div className="detail-item">
                <span className="label">Address:</span>
                <span className="value">{team.address}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="competitions-badges">
          <h3>COMPETITIONS BADGES</h3>
          <div className="badges-placeholder">
            {/* Tutaj mogą być dodane badges/emblematy rozgrywek */}
          </div>
        </div>
      </div>

      <div className="matches-section">
        <h2>Matches</h2>
        <div className="matches-container">
          {matches.length > 0 ? (
            matches.slice(0, 5).map((match, index) => (
              <div key={index} className="match-card">
                <div className="match-placeholder">
                  {/* Placeholder dla meczu - dane zależą od struktury API */}
                  <div className="match-date">
                    {match.utcDate ? new Date(match.utcDate).toLocaleDateString() : 'TBD'}
                  </div>
                  <div className="match-teams">
                    {match.homeTeam?.name || 'Home'} vs {match.awayTeam?.name || 'Away'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Placeholder mecze gdy brak danych
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="match-card placeholder">
                <div className="match-placeholder"></div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="team-section">
        <h2>Team</h2>
        <div className="players-grid">
        {players.length > 0 ? (
          players.map((player) => (
            <div key={player.id} className="player-card">
              <div className="image-skeleton infinite">
                <img 
                  src={player.imageUrl || fallbackImage} 
                  alt={player.name}
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                />
              </div>
              <div className="player-info">
                <span className="player-name">{player.name}</span>
              </div>
              <button
                className={`favorite-star ${player.isFavorite ? 'favorited' : ''}`}
                onClick={() => handleToggleFavorite(player.id)}
                title={player.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
              >
                {player.isFavorite ? '⭐' : '☆'}
              </button>
            </div>
          ))
        ) : (
          // Placeholder zawodnicy gdy brak danych
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="player-card placeholder">
              <div className="player-avatar">
                <div className="image-skeleton infinite"></div>
              </div>
              <div className="player-info">
                <span className="player-name">R. Lewandowski</span>
              </div>
              <button className="favorite-star">☆</button>
            </div>
          ))
        )}
        </div>
        
        {players.length > 6 && (
          <div className="show-more">
            <button className="show-more-btn">
              <span>⌄</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;