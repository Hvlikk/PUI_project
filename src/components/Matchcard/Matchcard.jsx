// Updated Matchcard.jsx with backend data format
import { useEffect, useState } from 'react';
import React from 'react';
import './Matchcard.scss';
import { FaStar, FaRegStar } from 'react-icons/fa';

function Matchcard({ match, teams, competitions, isFavourite = false, onFavouriteToggle }) {
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  if (!match) return null;

  // Backend provides team names directly in BasicMatchResponse
  const homeTeamName = match.homeTeamName || 'Home Team';
  const awayTeamName = match.awayTeamName || 'Away Team';
  
  // Find team details from teams array for crest (if needed)
  const homeTeam = teams.find(team => team.uuid === match.homeTeamUuid);
  const awayTeam = teams.find(team => team.uuid === match.awayTeamUuid);

  // Backend provides scores as Map<String, Integer> format
  const scoreHome = match.fullTimeScore?.home ?? '-';
  const scoreAway = match.fullTimeScore?.away ?? '-';
  
  // Status handling - backend uses different status values
  const status = match.status || 'SCHEDULED';
  const minute = match.minute || '';

  // For BasicMatchResponse, we might not have competition info
  // This would need to be added to the backend response
  const leagueName = 'Football'; // Default since BasicMatchResponse doesn't include competition
  useEffect(() => {
    const fetchCompetition = async () => {
      if (!match.compUuid) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8081/api/competitions/${match.compUuid}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCompetition(data);
        }
      } catch (error) {
        console.error('Failed to fetch competition:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [match.compUuid]);

  const handleStarClick = () => {
    if (onFavouriteToggle) {
      onFavouriteToggle(match.uuid, isFavourite);
    }

  if (loading) {
    return (
      <div className="match-card loading">
        <div className="loading-content"></div>
      </div>
    );
  }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'LIVE':
      case 'IN_PLAY':
        return minute ? `${minute}'` : 'LIVE';
      case 'FINISHED':
      case 'FULL_TIME':
        return 'FINISHED';
      case 'SCHEDULED':
      case 'TIMED':
        return match.utcDate ? new Date(match.utcDate).toLocaleString() : 'SCHEDULED';
      case 'PAUSED':
        return 'PAUSED';
      case 'POSTPONED':
        return 'POSTPONED';
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        return status || 'SCHEDULED';
    }
  };

  const isLive = status === 'LIVE' || status === 'IN_PLAY';
  const isFinished = status === 'FINISHED' || status === 'FULL_TIME';
  const isScheduled = status === 'SCHEDULED' || status === 'TIMED';

  return (
    <div className="match-card">
      <div className="match-header">
        <div className="match-league">
          {isLive && <span className="live-dot"></span>}
          {competition?.emblem ? (
            <img 
              src={competition.emblem} 
              alt={competition.name} 
              className="league-emblem"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline';
              }}
            />
          ) : null}
          <span style={{ display: competition?.emblem ? 'none' : 'inline' }}>
            {competition?.name || 'Football'}
          </span>
        </div>
      </div>

      <div className="match-body">
        <div className="team">
          <div className="team-logo">
            {homeTeam?.crest ? (
              <img src={homeTeam.crest} alt={homeTeamName} />
            ) : (
              <div className="team-logo-placeholder">{homeTeamName.charAt(0)}</div>
            )}
          </div>
          <div className="team-name">{homeTeamName}</div>
        </div>

        <div className="score-center">
          {isScheduled ? (
            <div className="scheduled-time">
              {match.utcDate ? 
                'SCHEDULED' 
                : 'SCHEDULED'
              }
            </div>
          ) : (
            <>
              <div className="score">{scoreHome} - {scoreAway}</div>
              {isLive && minute && (
                <div className="minute">{minute}'</div>
              )}
              {isFinished && (
                <div className="status">FINISHED</div>
              )}
            </>
          )}
        </div>

        <div className="team">
          <div className="team-logo">
            {awayTeam?.crest ? (
              <img src={awayTeam.crest} alt={awayTeamName} />
            ) : (
              <div className="team-logo-placeholder">{awayTeamName.charAt(0)}</div>
            )}
          </div>
          <div className="team-name">{awayTeamName}</div>
        </div>
      </div>

      <div className="match-footer">
        <div className="footer-date">
          {match.utcDate
            ? new Date(match.utcDate).toLocaleString([], {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'No date available'}
        </div>
      </div>
    </div>
  );
}

export default Matchcard;