import React from 'react';
import PlayersList from '../Playerslist/PlayersList'; // albo z innej ścieżki
import './Players.scss';

const Players = () => {
  return (
    <div>
      <div className='players-top'>
        <h1>Players</h1>
        <h2>Add players to your favorites! Just click ⭐!</h2>
      </div>
      <PlayersList />
    </div>
  );
};

export default Players;