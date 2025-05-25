import React, { useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="players-list">
      <h2>Zawodnicy</h2>
      <input
        type="text"
        placeholder="Wyszukaj zawodnika..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="players-grid">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <Link to={`/players/${player.id}`} key={player.id} className="player-card">
              <img src={player.photo} alt={player.name} />
              <h3>{player.name}</h3>
            </Link>
          ))
        ) : (
          <p>Brak zawodników spełniających kryteria wyszukiwania.</p>
        )}
      </div>
    </div>
  );
};

export default PlayersList;
