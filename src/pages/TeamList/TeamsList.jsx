import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TeamsList.scss';

const teams = [
  {
    id: 1,
    name: 'FC Barcelona',
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  },
  {
    id: 2,
    name: 'Paris Saint-Germain',
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/86/Paris_Saint-Germain_F.C..svg',
  },
  {
    id: 3,
    name: 'Manchester City',
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  },
];

const TeamsList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="teams-list">
      <h2>Drużyny</h2>
      <input
        type="text"
        placeholder="Wyszukaj drużynę..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="teams-grid">
        {filteredTeams.length > 0 ? (
          filteredTeams.map(team => (
            <Link to={`/teams/${team.id}`} key={team.id} className="team-card">
              <img src={team.logo} alt={team.name} />
              <h3>{team.name}</h3>
            </Link>
          ))
        ) : (
          <p>Brak drużyn spełniających kryteria wyszukiwania.</p>
        )}
      </div>
    </div>
  );
};

export default TeamsList;
