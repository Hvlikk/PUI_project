import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PlayerPage = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await fetch(`/api/players/${playerId}`);
        const data = await response.json();
        setPlayer(data);
      } catch (err) {
        setError('Unable to fetch player details.');
      }
    };

    fetchPlayerDetails();
  }, [playerId]);

  if (error) return <div>{error}</div>;

  if (!player) return <div>Loading...</div>;

  return (
    <div className="player-page">
      <h1>{player.name}</h1>
      <img src={player.imageUrl} alt={player.name} className="player-image" />
      <p>Position: {player.position}</p>
      <p>Nationality: {player.nationality}</p>
      {/* Additional player details, like career stats */}
    </div>
  );
};

export default PlayerPage;
