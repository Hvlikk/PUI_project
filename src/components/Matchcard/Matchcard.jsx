// Updated Matchcard.jsx
import React from 'react';
import './Matchcard.scss';
import { FaStar } from 'react-icons/fa';

function Matchcard({ match, teams, competitions }) {
  if (!match) return null;

  const homeTeam = teams.find(team => team.id === match.homeTeamId);
  const awayTeam = teams.find(team => team.id === match.awayTeamId);
  const competition = competitions.find(c => c.id === match.competitionId);

  const scoreHome = match.score?.fullTime?.home ?? '-';
  const scoreAway = match.score?.fullTime?.away ?? '-';
  const minute = match.minute || '';
  const leagueName = competition?.name || 'Football';

  return (
    <div className="match-card">
      <div className="match-header">
        <div className="match-league">
          {match.status === 'LIVE' && <span className="live-dot"></span>}
          {leagueName}
        </div>
        <div className="star"><FaStar /></div>
      </div>

      <div className="match-body">
        <div className="team">
          <div className="team-logo">
            {homeTeam?.crest && <img src={homeTeam.crest} alt={homeTeam.name} />}
          </div>
          <div className="team-name">{homeTeam?.name || 'Home Team'}</div>
        </div>

        <div className="score-center">
          <div className="score">{scoreHome} - {scoreAway}</div>
          {minute && <div className="minute">{minute}'</div>}
        </div>

        <div className="team">
          <div className="team-logo">
            {awayTeam?.crest && <img src={awayTeam.crest} alt={awayTeam.name} />}
          </div>
          <div className="team-name">{awayTeam?.name || 'Away Team'}</div>
        </div>
      </div>

      <div className="match-footer">
        <div>Statistics</div>
        <div>Line-ups</div>
        <div className="mute">🔇</div>
      </div>
    </div>
  );
}

export default Matchcard;
