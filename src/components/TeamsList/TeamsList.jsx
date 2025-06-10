import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamsList.scss';

const fallbackImage = 'https://via.placeholder.com/300x300.png?text=Team+Logo';

// 🎭 Mockowane dane jako fallback
const mockTeams = [
  {
    id: 'mock-1',
    name: 'FC Barcelona',
    league: 'La Liga',
    imageUrl: fallbackImage,
    isFavorite: false,
  },
  {
    id: 'mock-2',
    name: 'Real Madrid',
    league: 'La Liga',
    imageUrl: fallbackImage,
    isFavorite: true,
  },
  {
      id: 'mock-3',
    name: 'Manchester United',
    league: 'Premier League',
    imageUrl: fallbackImage,
    isFavorite: false,
  },
  {
    id: 'mock-4',
    name: 'Bayern Munich',
    league: 'Bundesliga',
    imageUrl: fallbackImage,
    isFavorite: false,
  },
  {
    id: 'mock-5',
    name: 'Paris Saint-Germain',
    league: 'Ligue 1',
    imageUrl: fallbackImage,
    isFavorite: true,
  },
];

const TeamsList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamsAndFavorites = async () => {
      console.log('🔥 Starting API call for teams...'); // Debug log
      try {
        const token = localStorage.getItem('token');
        console.log('🔑 Token:', token ? 'exists' : 'missing'); // Debug log
        
        // Pobierz drużyny i ulubione równolegle
        const [teamsRes, favoritesRes] = await Promise.all([
          fetch('http://localhost:8081/api/teams', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('http://localhost:8081/api/teams/favourites', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        ]);

        console.log('📡 Teams API Response status:', teamsRes.status); // Debug log
        console.log('📡 Favorites API Response status:', favoritesRes.status); // Debug log

        if (!teamsRes.ok) throw new Error(`Teams API returned status ${teamsRes.status}`);
        if (!favoritesRes.ok) throw new Error(`Favorites API returned status ${favoritesRes.status}`);

        const teamsData = await teamsRes.json();
        const favoritesData = await favoritesRes.json();
        
        console.log('📦 Teams Data received:', teamsData); // Debug log
        console.log('📦 Favorites Data received:', favoritesData); // Debug log

        // Stwórz set z ID ulubionych drużyn dla szybkiego wyszukiwania
        const favoriteTeamIds = new Set(favoritesData.map(fav => fav.uuid));

        const mappedTeams = teamsData.map(team => ({
          id: team.uuid,
          name: team.name,
          league: 'Unknown',
          imageUrl: fallbackImage,
          isFavorite: favoriteTeamIds.has(team.uuid), // Sprawdź czy jest w ulubionych
          imageLoaded: false,
        }));

        console.log('🎯 Mapped teams:', mappedTeams); // Debug log
        setTeams(mappedTeams);
        setError('');

        // Symulacja załadowania obrazków po 1 sekundzie
        setTimeout(() => {
          setTeams((prev) =>
            prev.map((team) => ({ ...team, imageLoaded: true }))
          );
        }, 1000);
      } catch (err) {
        console.error('❌ Failed to fetch teams or favorites:', err);
        console.log('🎭 Using mock data as fallback');
        setError('Używam danych testowych (API niedostępne)');
        const teamsWithImageLoaded = mockTeams.map(team => ({
          ...team,
          imageLoaded: false,
        }));
        setTeams(teamsWithImageLoaded);

        // Symulacja załadowania obrazków dla mock data
        setTimeout(() => {
          setTeams((prev) =>
            prev.map((team) => ({ ...team, imageLoaded: true }))
          );
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndFavorites();
  }, []);

  const toggleFavorite = async (teamId, currentlyFavorite) => {
    // Sprawdź czy to mock data
    if (teamId.startsWith('mock-')) {
      console.log('🎭 Mock favorite toggle for:', teamId);
      setTeams(prev =>
        prev.map(t =>
          t.id === teamId ? { ...t, isFavorite: !currentlyFavorite } : t
        )
      );
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:8081/api/teams/${teamId}/favourites`;
      const method = currentlyFavorite ? 'DELETE' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`API returned status ${res.status}`);

      setTeams(prev =>
        prev.map(t =>
          t.id === teamId ? { ...t, isFavorite: !currentlyFavorite } : t
        )
      );
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      alert('Nie udało się zaktualizować ulubionych.');
    }
  };

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  // 🔍 Filtrowanie po nazwie
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="teams-list-container">
        <p className="loading-message">Ładowanie drużyn...</p>
      </div>
    );
  }

  return (
    <div className="teams-list-container">
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Szukaj drużyny..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="teams-grid">
        {filteredTeams.length === 0 ? (
          <p className="no-results">
            {searchTerm
              ? 'Brak drużyn pasujących do wyszukiwania.'
              : 'Brak dostępnych drużyn.'}
          </p>
        ) : (
          filteredTeams.map(team => (
            <div
              key={team.id}
              className="team-item"
              onClick={() => handleTeamClick(team.id)}
            >
              <div className="team-avatar">
                {/*!team.imageLoaded && */<div className="image-skeleton infinite" />}
                <img
                  src={team.imageUrl}
                  alt={team.name}
                  style={{ display: team.imageLoaded ? 'block' : 'none' }}
                />
              </div>
              <span className="team-name">{team.name}</span>
              <button
                className={`favorite-star ${team.isFavorite ? 'favorited' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(team.id, team.isFavorite);
                }}
              >
                {team.isFavorite ? '⭐' : '☆'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamsList;