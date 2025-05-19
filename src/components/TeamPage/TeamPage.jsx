import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TeamPage = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}`);
        const data = await response.json();
        setTeam(data);
      } catch (err) {
        setError('Unable to fetch team details.');
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  if (error) return <div>{error}</div>;

  if (!team) return <div>Loading...</div>;

  return (
    <div className="team-page">
      <h1>{team.name}</h1>
      <img src={team.crestUrl} alt={team.name} className="team-logo" />
      <p>Founded: {team.founded}</p>
      <p>Stadium: {team.venue}</p>
      <p>Coach: {team.coach}</p>
      {/* Additional team details, like squad, results, etc. */}
    </div>
  );
};

export default TeamPage;
