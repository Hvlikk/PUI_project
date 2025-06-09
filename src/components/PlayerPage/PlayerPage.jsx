import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PlayerPage.scss';

const PlayerPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8081/api/players/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error(`API returned status ${res.status}`);
        const data = await res.json();

        setPlayer({
          name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          position: data.position || 'Unknown',
          nationality: data.nationality || '',
          dateOfBirth: data.dateOfBirth || '',
          team: data.teamName || data.clubName || '',
          shirtNumber: data.shirtNumber || data.jerseyNumber || '',
          height: data.height || '',
          weight: data.weight || '',
          preferredFoot: data.preferredFoot || '',
          marketValue: data.marketValue || '',
          contractUntil: data.contractUntil || '',
          imageUrl: data.imageUrl || '', // tutaj URL do obrazka zawodnika z API
        });
        setError('');
      } catch (err) {
        console.error('Failed to fetch player:', err);
        setError('Nie udało się pobrać danych zawodnika.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('pl-PL');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="player-page-wp">
        <div className="loading">Ładowanie...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player-page-wp">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!player) return null;

  return (
    <div className="player-page-wp">
      <div className="player-container">
        <div className="player-header">
          {/* Skeleton na obrazku jeśli obrazek się nie załadował */}
          {player.imageUrl ? (
            <img
              src={player.imageUrl}
              alt={player.name}
              className={`player-image ${!imageLoaded ? 'skeleton' : ''}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // jeśli błąd w ładowaniu, usuń skeleton
            />
          ) : (
            // fallback pusty div z skeletonem
            <div className="player-image skeleton"></div>
          )}

          <div className="player-basic-info">
            <h1 className="player-name">
              {player.name || `${player.firstName} ${player.lastName}`}
            </h1>
            <div className="player-position">{player.position}</div>
          </div>
        </div>
        <div className="player-details">
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">Nationality:</div>
              <div className="detail-value">{player.nationality || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Date of birth:</div>
              <div className="detail-value">{formatDate(player.dateOfBirth) || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Team:</div>
              <div className="detail-value">{player.team || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Shirt number:</div>
              <div className="detail-value">{player.shirtNumber || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Position:</div>
              <div className="detail-value">{player.position}</div>
            </div>

            {player.height && (
              <div className="detail-item">
                <div className="detail-label">Height:</div>
                <div className="detail-value">{player.height}</div>
              </div>
            )}
            {player.weight && (
              <div className="detail-item">
                <div className="detail-label">Weight:</div>
                <div className="detail-value">{player.weight}</div>
              </div>
            )}
            {player.preferredFoot && (
              <div className="detail-item">
                <div className="detail-label">Preferred foot:</div>
                <div className="detail-value">{player.preferredFoot}</div>
              </div>
            )}
            {player.marketValue && (
              <div className="detail-item">
                <div className="detail-label">Market value:</div>
                <div className="detail-value">{player.marketValue}</div>
              </div>
            )}
            {player.contractUntil && (
              <div className="detail-item">
                <div className="detail-label">Contract until:</div>
                <div className="detail-value">{formatDate(player.contractUntil)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Link to="/players" className="back-button">
        ← Powrót do listy zawodników
      </Link>
    </div>
  );
};

export default PlayerPage;
