import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StatisticsPage = () => {
  const { leagueId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await fetch(`/api/statistics/${leagueId}`);
        if (!res.ok) throw new Error('Failed to fetch statistics');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [leagueId]);

  if (loading) return <p>Loading statistics...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!stats) return <p>No statistics available.</p>;

  return (
    <div className="statistics-page">
      <h2>{leagueId === 'all' ? 'Global Statistics' : `Statistics for League ID: ${leagueId}`}</h2>
      <ul>
        <li><strong>Top Scorer:</strong> {stats.topScorer.name} ({stats.topScorer.goals} goals)</li>
        <li><strong>Most Assists:</strong> {stats.topAssists.name} ({stats.topAssists.assists} assists)</li>
        <li><strong>Clean Sheets:</strong> {stats.topKeeper.name} ({stats.topKeeper.cleanSheets} clean sheets)</li>
        {/* Dodaj więcej pól w zależności od tego co zwraca API */}
      </ul>
    </div>
  );
};

export default StatisticsPage;
