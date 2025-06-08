import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './PlayerCard.scss';

const PlayerCard = ({ player, onToggleFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/players/${player.id}`}
      className="see-profile"
      onClick={e => {
        if (e.target.closest('.favorite-star')) {
          e.preventDefault(); // żeby kliknięcie na gwiazdkę nie odpalało linku
        }
      }}
    >
      <div className="player-card">
        {!imageLoaded && <div className="skeleton skeleton-circle" />}
        <img
          src={player.imageUrl}
          alt={player.name}
          className={`player-image ${imageLoaded ? 'visible' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="player-info">
          <h3>{player.name}</h3>
          <FaStar
            className={`favorite-star ${player.isFavorite ? 'favorite' : ''}`}
            onClick={e => {
              e.preventDefault();
              onToggleFavorite();
            }}
            size={24}
            title={player.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          />
        </div>
      </div>
    </Link>
  );
};

export default PlayerCard;
