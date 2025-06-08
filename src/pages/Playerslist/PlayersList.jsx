import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayersList.scss';

const fallbackImage = 'https://via.placeholder.com/300x300.png?text=No+Image';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
          imageLoaded: false,
        }));

        setPlayers(mappedPlayers);
        setError('');

        // Symulacja załadowania obrazków po 1 sekundzie
        setTimeout(() => {
          setPlayers((prev) =>
            prev.map((player) => ({ ...player, imageLoaded: true }))
          );
        }, 1000);
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

  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  // 🔍 Filtrowanie po nazwie
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="players-list-container">
        <p className="loading-message">Ładowanie zawodników...</p>
      </div>
    );
  }

  return (
    <div className="players-list-container">
      {error && <p className="error-message">{error}</p>}
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Szukaj zawodnika..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="players-grid">
        {filteredPlayers.length === 0 ? (
          <p className="no-results">
            {searchTerm
              ? 'Brak zawodników pasujących do wyszukiwania.'
              : 'Brak dostępnych zawodników.'}
          </p>
        ) : (
          filteredPlayers.map(player => (
            <div
              key={player.id}
              className="player-item"
              onClick={() => handlePlayerClick(player.id)}
            >
              <div className="player-avatar">
                {<div className="image-skeleton infinite" />}
                <img
                  src={player.imageUrl}
                  alt={player.name}
                  style={{ display: player.imageLoaded ? 'block' : 'none' }}
                />
              </div>
              <span className="player-name">{player.name}</span>
              <button
                className={`favorite-star ${player.isFavorite ? 'favorited' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(player.id, player.isFavorite);
                }}
              >
                {player.isFavorite ? '⭐' : '☆'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayersList;