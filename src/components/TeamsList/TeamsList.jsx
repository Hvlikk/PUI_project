import React, { useEffect, useState } from 'react';
import TeamCard from '../../components/TeamCard/TeamCard';
import './TeamsList.scss';

const fallbackImage = 'https://via.placeholder.com/300x300.png?text=No+Image';

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
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 Nowy stan

  useEffect(() => {
    const fetchTeams = async () => {
      console.log('🔥 Starting API call for teams...'); // Debug log
      try {
        const token = localStorage.getItem('token');
        console.log('🔑 Token:', token ? 'exists' : 'missing'); // Debug log
        
        const res = await fetch('http://localhost:8081/api/teams', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 API Response status:', res.status); // Debug log

        if (!res.ok) throw new Error(`API returned status ${res.status}`);

        const data = await res.json();
        console.log('📦 API Data received:', data); // Debug log

        const mappedTeams = data.map(team => ({
          id: team.uuid,
          name: team.name,
          league: 'Unknown',
          imageUrl: fallbackImage,
          isFavorite: false,
        }));

        console.log('🎯 Mapped teams:', mappedTeams); // Debug log
        setTeams(mappedTeams);
        setError('');
      } catch (err) {
        console.error('❌ Failed to fetch teams:', err);
        console.log('🎭 Using mock data as fallback');
        setError('Używam danych testowych (API niedostępne)');
        setTeams(mockTeams); // Użyj mockowanych danych zamiast pustej tablicy
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
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
      const url = `http://localhost:8081/api/users/favourites/teams/${teamId}`;
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

  // 🔍 Filtrowanie po nazwie
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p style={{ textAlign: 'center' }}>Ładowanie drużyn...</p>;
  if (error && teams.length === 0) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div className="teams-list">
      {error && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          color: '#856404',
          border: '1px solid #ffeaa7',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Szukaj drużyny..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTeams.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Brak drużyn pasujących do wyszukiwania.</p>
      ) : (
        <div className="teams-grid">
          {filteredTeams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onToggleFavorite={() => toggleFavorite(team.id, team.isFavorite)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsList;