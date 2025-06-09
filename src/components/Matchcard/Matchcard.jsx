// Updated Matchcard.jsx with favourite functionality
import React from 'react';
import './Matchcard.scss';
import { FaStar, FaRegStar } from 'react-icons/fa';

function Matchcard({ match, teams, competitions, isFavourite = false, onFavouriteToggle }) {
  if (!match) return null;

  const homeTeam = teams.find(team => team.id === match.homeTeamId);
  const awayTeam = teams.find(team => team.id === match.awayTeamId);
  const competition = competitions.find(c => c.id === match.competitionId);

  const scoreHome = match.score?.fullTime?.home ?? '-';
  const scoreAway = match.score?.fullTime?.away ?? '-';
  const minute = match.minute || '';
  const leagueName = competition?.name || 'Football';

  const handleStarClick = () => {
    if (onFavouriteToggle) {
      onFavouriteToggle(match.id, isFavourite);
    }
  };

  const getStatusDisplay = () => {
    switch (match.status) {
      case 'LIVE':
        return minute ? `${minute}'` : 'LIVE';
      case 'FINISHED':
        return 'FINISHED';
      case 'SCHEDULED':
        return match.utcDate ? new Date(match.utcDate).toLocaleString() : 'SCHEDULED';
      default:
        return match.status || '';
    }
  };

  return (
    <div className="match-card">
      <div className="match-header">
        <div className="match-league">
          {match.status === 'LIVE' && <span className="live-dot"></span>}
          {leagueName}
        </div>
      </div>

      <div className="match-body">
        <div className="team">
          <div className="team-logo">
            {homeTeam?.crest ? (
              <img src={homeTeam.crest} alt={homeTeam.name} />
            ) : (
              <div className="team-logo-placeholder">{homeTeam?.name?.charAt(0) || 'H'}</div>
            )}
          </div>
          <div className="team-name">{homeTeam?.name || 'Home Team'}</div>
        </div>

        <div className="score-center">
          {match.status === 'SCHEDULED' ? (
            <div className="scheduled-time">
              {match.utcDate ? 
                new Date(match.utcDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                : '--:--'
              }
            </div>
          ) : (
            <>
              <div className="score">{scoreHome} - {scoreAway}</div>
              {match.status === 'LIVE' && minute && (
                <div className="minute">{minute}'</div>
              )}
              {match.status === 'FINISHED' && (
                <div className="status">FINISHED</div>
              )}
            </>
          )}
        </div>

        <div className="team">
          <div className="team-logo">
            {awayTeam?.crest ? (
              <img src={awayTeam.crest} alt={awayTeam.name} />
            ) : (
              <div className="team-logo-placeholder">{awayTeam?.name?.charAt(0) || 'A'}</div>
            )}
          </div>
          <div className="team-name">{awayTeam?.name || 'Away Team'}</div>
        </div>
      </div>

      <div className="match-footer">
        <div className="footer-item">Statistics</div>
        <div className="footer-item">Line-ups</div>
      </div>
    </div>
  );
}

export default Matchcard;