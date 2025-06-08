import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FavoritesList.scss';

const fallbackPlayerImage = 'https://via.placeholder.com/300x300.png?text=No+Image';
const fallbackTeamImage = 'https://via.placeholder.com/300x300.png?text=Team+Logo';

const FavoritesList = ({ type, searchQuery }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const mockTeams = [
    { id: '1', name: 'FC BARCELONA', imageUrl: fallbackTeamImage },
    { id: '2', name: 'REAL MADRID', imageUrl: fallbackTeamImage },
    { id: '3', name: 'MANCHESTER UNITED', imageUrl: fallbackTeamImage },
    { id: '4', name: 'BAYERN MUNICH', imageUrl: fallbackTeamImage },
    { id: '5', name: 'JUVENTUS', imageUrl: fallbackTeamImage },
  ];

  const mockPlayers = [
    { id: '1', name: 'Cristiano Ronaldo', imageUrl: fallbackPlayerImage },
    { id: '2', name: 'Marcus Rashford', imageUrl: fallbackPlayerImage },
    { id: '3', name: 'Lionel Messi', imageUrl: fallbackPlayerImage },
    { id: '4', name: 'Robert Lewandowski', imageUrl: fallbackPlayerImage },
    { id: '5', name: 'Cristiano Ronaldo', imageUrl: fallbackPlayerImage },
    { id: '6', name: 'Marcus Rashford', imageUrl: fallbackPlayerImage },
    { id: '7', name: 'Lionel Messi', imageUrl: fallbackPlayerImage },
    { id: '8', name: 'Robert Lewandowski', imageUrl: fallbackPlayerImage },
    { id: '9', name: 'Cristiano Ronaldo', imageUrl: fallbackPlayerImage },
    { id: '10', name: 'Marcus Rashford', imageUrl: fallbackPlayerImage },
    { id: '11', name: 'Lionel Messi', imageUrl: fallbackPlayerImage },
    { id: '12', name: 'Robert Lewandowski', imageUrl: fallbackPlayerImage },
    { id: '13', name: 'Cristiano Ronaldo', imageUrl: fallbackPlayerImage },
    { id: '14', name: 'Marcus Rashford', imageUrl: fallbackPlayerImage },
    { id: '15', name: 'Lionel Messi', imageUrl: fallbackPlayerImage },
    { id: '16', name: 'Robert Lewandowski', imageUrl: fallbackPlayerImage },
    { id: '17', name: 'Cristiano Ronaldo', imageUrl: fallbackPlayerImage },
    { id: '18', name: 'Marcus Rashford', imageUrl: fallbackPlayerImage },
    { id: '19', name: 'Lionel Messi', imageUrl: fallbackPlayerImage },
    { id: '20', name: 'Robert Lewandowski', imageUrl: fallbackPlayerImage },
    { id: '21', name: 'Cristiano Ronaldo', imageUrl: fallbackPlayerImage },
    { id: '22', name: 'Marcus Rashford', imageUrl: fallbackPlayerImage },
    { id: '23', name: 'Lionel Messi', imageUrl: fallbackPlayerImage },
    { id: '24', name: 'Robert Lewandowski', imageUrl: fallbackPlayerImage },
    { id: '25', name: 'Cristiano Ronaldo', imageUrl: fallbackPlayerImage },
    { id: '26', name: 'Marcus Rashford', imageUrl: fallbackPlayerImage },
    { id: '27', name: 'Lionel Messi', imageUrl: fallbackPlayerImage },
  ];

  useEffect(() => {
    fetchFavorites();
  }, [type]);

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const endpoint =
        type === 'teams'
          ? 'http://localhost:8081/api/favorites/teams'
          : 'http://localhost:8081/api/favorites/players';

      let items = [];

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          items = data.map((item) => ({
            id: item.uuid || item.id,
            name: item.name || `Unknown ${type === 'teams' ? 'Team' : 'Player'}`,
            imageUrl: item.imageUrl || (type === 'teams' ? fallbackTeamImage : fallbackPlayerImage),
            isFavorite: true,
            imageLoaded: false,
          }));
        } else {
          items = (type === 'teams' ? mockTeams : mockPlayers).map((item) => ({
            ...item,
            isFavorite: true,
            imageLoaded: false,
          }));
        }
      } catch {
        items = (type === 'teams' ? mockTeams : mockPlayers).map((item) => ({
          ...item,
          isFavorite: true,
          imageLoaded: false,
        }));
      }

      // Symulacja załadowania obrazków po 1 sekundzie
      setFavoriteItems(items);
      setTimeout(() => {
        setFavoriteItems((prev) =>
          prev.map((item) => ({ ...item, imageLoaded: false }))
        );
      }, 1000);
    } catch (err) {
      setError(`Nie udało się pobrać ulubionych ${type === 'teams' ? 'drużyn' : 'zawodników'}.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (itemId, currentlyFavorite) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint =
        type === 'teams'
          ? `http://localhost:8081/api/favorites/teams/${itemId}`
          : `http://localhost:8081/api/favorites/players/${itemId}`;
      const method = currentlyFavorite ? 'DELETE' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        if (currentlyFavorite) {
          setFavoriteItems((prev) => prev.filter((item) => item.id !== itemId));
        }
      } else {
        throw new Error();
      }
    } catch {
      alert(`Nie udało się zaktualizować ulubionych ${type === 'teams' ? 'drużyn' : 'zawodników'}.`);
    }
  };

  const handleItemClick = (itemId) => {
    navigate(type === 'teams' ? `/teams/${itemId}` : `/players/${itemId}`);
  };

  const filteredItems = favoriteItems.filter((item) =>
    item.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  if (loading) {
    return (
      <div className="favorites-list-container">
        <p className="loading-message">Ładowanie ulubionych...</p>
      </div>
    );
  }

  return (
    <div className="favorites-list-container">
      {error && <p className="error-message">{error}</p>}

      <div className="favorites-grid">
        {filteredItems.length === 0 ? (
          <p className="no-results">
            {searchQuery
              ? `Brak ${type === 'teams' ? 'drużyn' : 'zawodników'} pasujących do wyszukiwania.`
              : `Brak ulubionych ${type === 'teams' ? 'drużyn' : 'zawodników'}.`}
          </p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="favorite-item"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="favorite-avatar">
                {!item.imageLoaded && <div className="image-skeleton infinite" />}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ display: item.imageLoaded ? 'block' : 'none' }}
                />
              </div>
              <span className="favorite-name">{item.name}</span>
              <button
                className="favorite-star"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id, item.isFavorite);
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
};

export default FavoritesList;
