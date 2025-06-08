import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const fallbackImage = 'https://via.placeholder.com/400x400.png?text=No+Image';

const TeamPage = () => {
  const { id } = useParams(); // <- uuid z URL
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8081/api/teams/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error(`API returned status ${res.status}`);
        const data = await res.json();

        setTeam({
          name: data.name,
          league: data.league || 'Unknown',
          imageUrl: fallbackImage, // lub data.imageUrl jeśli dostępne
        });
        setError('');
      } catch (err) {
        console.error('Failed to fetch team:', err);
        setError('Nie udało się pobrać danych drużyny.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center' }}>Ładowanie...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!team) return null;

  return (
    <div className="team-page">
      <img src={team.imageUrl} alt={team.name} />
      <h2>{team.name}</h2>
      <p>Liga: {team.league}</p>
      {/* Możesz dodać więcej danych, np. miasto, założenie, itd. */}
    </div>
  );
};

export default TeamPage;