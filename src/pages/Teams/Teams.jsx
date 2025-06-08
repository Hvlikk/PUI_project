import React from 'react';
import TeamsList from '../../components/TeamsList/TeamsList'; // albo z innej ścieżki
import './Teams.scss';

const Teams = () => {
  return (
    <div className='top'>
      <div className='top'>
        <h1>Teams</h1>
        <h2>Add teams to your favorites! Just click ⭐!</h2>
      </div>
      <TeamsList />
    </div>
  );
};

export default Teams;