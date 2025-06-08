import React, { useEffect, useState } from 'react';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import './PlayersList.scss';

const fallbackImage = 'https://via.placeholder.com/300x300.png?text=No+Image';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 Nowy stan

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8081/api/players', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error(`API returned status ${res.status}`);

        const data = await res.json();

        const mappedPlayers = data.map(player => ({
          id: player.uuid,
          name: player.name,
          position: 'Unknown',
          imageUrl: fallbackImage,
          isFavorite: false,
        }));

        setPlayers(mappedPlayers);
        setError('');
      } catch (err) {
        console.error('Failed to fetch players:', err);
        setError('Nie udało się pobrać listy zawodników.');
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const toggleFavorite = async (playerId, currentlyFavorite) => {
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:8081/api/users/favourites/players/${playerId}`;
      const method = currentlyFavorite ? 'DELETE' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`API returned status ${res.status}`);

      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId ? { ...p, isFavorite: !currentlyFavorite } : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      alert('Nie udało się zaktualizować ulubionych.');
    }
  };

  // 🔍 Filtrowanie po nazwie
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p style={{ textAlign: 'center' }}>Ładowanie zawodników...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div className="players-list">
      <div className="search-container">
        <input
          type="text"
          placeholder="Szukaj zawodnika..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPlayers.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Brak zawodników pasujących do wyszukiwania.</p>
      ) : (
        <div className="players-grid">
          {filteredPlayers.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              onToggleFavorite={() => toggleFavorite(player.id, player.isFavorite)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayersList;
