import React from 'react';
import { Link } from 'react-router-dom';
import './PlayersList.scss';

const players = [
  {
    id: 1,
    name: 'Robert Lewandowski',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Robert_Lewandowski_2021.jpg',
  },
  {
    id: 2,
    name: 'Kylian Mbappé',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Kylian_Mbapp%C3%A9_2019.jpg',
  },
  {
    id: 3,
    name: 'Erling Haaland',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Erling_Haaland_2020.jpg',
  },
];

const PlayersList = () => {
  return (
    <div className="players-list">
      <h2>Zawodnicy</h2>
      <div className="players-grid">
        {players.map((player) => (
          <Link to={`/players/${player.id}`} key={player.id} className="player-card">
            <img src={player.photo} alt={player.name} />
            <h3>{player.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
