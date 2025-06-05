import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Teams.scss';

// Fallback dane (zostają jak było)
const fallbackTeams = {
  1: {
    name: 'FC Barcelona',
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
    founded: 1899,
    stadium: 'Spotify Camp Nou',
    country: 'Hiszpania',
  },
  2: {
    name: 'Paris Saint-Germain',
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/86/Paris_Saint-Germain_F.C..svg',
    founded: 1970,
    stadium: 'Parc des Princes',
    country: 'Francja',
  },
  3: {
    name: 'Manchester City',
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
    founded: 1880,
    stadium: 'Etihad Stadium',
    country: 'Anglia',
  },
};

const Team = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/teams/${id}`);
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const data = await res.json();
        setTeam(data);
      } catch (err) {
        console.warn('Błąd API – używam danych zapasowych:', err.message);
        setError('Nie udało się pobrać danych z serwera. Pokazuję dane zapasowe.');
        setTeam(fallbackTeams[id] || null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center' }}>Ładowanie danych drużyny...</p>;
  if (!team) return <p style={{ textAlign: 'center', color: '#c00' }}>Nie znaleziono drużyny.</p>;

  return (
    <div className="team-profile">
      {error && (
        <div className="error-message" style={{ color: '#c00', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="team-header">
        <img src={team.logo} alt={team.name} className="team-logo" />
        <h2>{team.name}</h2>
      </div>

      <div className="team-details">
        <p><strong>Kraj:</strong> {team.country}</p>
        <p><strong>Rok założenia:</strong> {team.founded}</p>
        <p><strong>Stadion:</strong> {team.stadium}</p>
      </div>
    </div>
  );
};

export default Team;
