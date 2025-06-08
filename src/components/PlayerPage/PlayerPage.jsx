import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const fallbackImage = 'https://via.placeholder.com/400x400.png?text=No+Image';

const PlayerPage = () => {
  const { id } = useParams(); // <- uuid z URL
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8081/api/players/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error(`API returned status ${res.status}`);
        const data = await res.json();

        setPlayer({
          name: data.name || `${data.firstName} ${data.lastName}`,
          position: data.position || 'Unknown',
          imageUrl: fallbackImage, // lub data.imageUrl jeśli dostępne
        });
        setError('');
      } catch (err) {
        console.error('Failed to fetch player:', err);
        setError('Nie udało się pobrać danych zawodnika.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center' }}>Ładowanie...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!player) return null;

  return (
    <div className="player-page">
      <img src={player.imageUrl} alt={player.name} />
      <h2>{player.name}</h2>
      <p>Pozycja: {player.position}</p>
      {/* Możesz dodać więcej danych, np. klub, narodowość, itd. */}
    </div>
  );
};

export default PlayerPage;
