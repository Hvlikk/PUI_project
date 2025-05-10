import React from 'react';
import { Link } from 'react-router-dom';

const TeamCard = ({ team }) => {
  return (
    <div className="team-card">
      <img src={team.crestUrl} alt={team.name} className="team-logo" />
      <h3>{team.name}</h3>
      <p>{team.country}</p>
      <Link to={`/team/${team.id}`}>See Profile</Link>
    </div>
  );
};

export default TeamCard;
