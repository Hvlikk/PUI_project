import React from 'react';
import { Link } from 'react-router-dom';

const PlayerCard = ({ player }) => {
  return (
    <div className="player-card">
      <img src={player.imageUrl} alt={player.name} className="player-image" />
      <h3>{player.name}</h3>
      <p>{player.position}</p>
      <Link to={`/player/${player.id}`}>See Profile</Link>
    </div>
  );
};

export default PlayerCard;
