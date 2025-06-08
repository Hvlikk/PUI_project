import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './TeamCard.scss';

const TeamCard = ({ team, onToggleFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/teams/${team.id}`}
      className="see-profile"
      onClick={e => {
        if (e.target.closest('.favorite-star')) {
          e.preventDefault(); // żeby kliknięcie na gwiazdkę nie odpalało linku
        }
      }}
    >
      <div className="team-card">
        {!imageLoaded && <div className="skeleton skeleton-circle" />}
        <img
          src={team.imageUrl}
          alt={team.name}
          className={`team-image ${imageLoaded ? 'visible' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="team-info">
          <h3>{team.name}</h3>
          <FaStar
            className={`favorite-star ${team.isFavorite ? 'favorite' : ''}`}
            onClick={e => {
              e.preventDefault();
              onToggleFavorite();
            }}
            size={24}
            title={team.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          />
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;