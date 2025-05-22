import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Players.scss';

const fallbackData = {
  1: {
    name: 'Robert Lewandowski',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Robert_Lewandowski_2022.jpg/440px-Robert_Lewandowski_2022.jpg',
    nationality: 'Poland',
    dateOfBirth: '1988-08-21',
    team: 'FC Barcelona',
    shirtNumber: 9,
    position: 'Forward'
  },
  2: {
    name: 'Kylian Mbappé',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Kylian_Mbappé_2019.jpg/440px-Kylian_Mbappé_2019.jpg',
    nationality: 'France',
    dateOfBirth: '1998-12-20',
    team: 'Paris Saint-Germain',
    shirtNumber: 7,
    position: 'Forward'
  }
};

const Players = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    // Replace with your real API call later
    const fetchPlayer = async () => {
      try {
        // const response = await fetch(`https://your-api/players/${id}`);
        // const data = await response.json();
        // setPlayer(data);
        
        // TEMP fallback:
        setPlayer(fallbackData[id] || null);
      } catch (err) {
        console.error('Error fetching player data:', err);
      }
    };

    fetchPlayer();
  }, [id]);

  if (!player) return <p style={{ textAlign: 'center' }}>Loading player data...</p>;

  return (
    <div className="player-profile">
      <div className="player-header">
        <img src={player.photo} alt={player.name} className="player-photo" />
        <h2>{player.name}</h2>
      </div>
      <div className="player-details">
        <p><strong>Nationality:</strong> {player.nationality}</p>
        <p><strong>Date of Birth:</strong> {player.dateOfBirth}</p>
        <p><strong>Team:</strong> {player.team}</p>
        <p><strong>Shirt Number:</strong> {player.shirtNumber}</p>
        <p><strong>Position:</strong> {player.position}</p>
      </div>
    </div>
  );
};

export default Players;
