import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StandingsPage = () => {
  const { leagueId } = useParams();
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/competitions/${leagueId}`);
        if (!response.ok) throw new Error('Failed to fetch standings');
        const data = await response.json();
        setStandings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [leagueId]);

  if (loading) return <p>Loading standings...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!standings.length) return <p>No standings data available.</p>;

  return (
    <div className="standings-page">
      <h2>{leagueId === 'all' ? 'Global Standings' : `Standings for League ID: ${leagueId}`}</h2>
      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.id || index}>
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>{team.played}</td>
              <td>{team.wins}</td>
              <td>{team.draws}</td>
              <td>{team.losses}</td>
              <td>{team.goalsFor}</td>
              <td>{team.goalsAgainst}</td>
              <td>{team.goalsFor - team.goalsAgainst}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsPage;
