import React, { useState, useEffect } from 'react';
import './News.scss';
import { FaFutbol } from 'react-icons/fa';

const fallbackData = [
  {
    id: 1,
    date: '2025-05-22',
    title: 'New Feature: Dark Mode!',
    excerpt: 'We’ve introduced a new dark mode for user comfort...',
    content: 'In the new version of ScoreTracker, we’ve added the ability to switch between light and dark themes. This works globally and remembers user preferences. In the new version of ScoreTracker, we’ve added the ability to switch between light and dark themes. This works globally and remembers user preferences. In the new version of ScoreTracker, we’ve added the ability to switch between light and dark themes. This works globally and remembers user preferences.'
  },
  {
    id: 2,
    date: '2025-05-20',
    title: 'Updates in the "Games" Section',
    excerpt: 'The "Games" section has been expanded with new match tracking features...',
    content: 'Users can now follow live matches with access to real-time stats, commentary, and substitutions.'
  },
  {
    id: 3,
    date: '2025-05-18',
    title: 'League and Table Update',
    excerpt: 'We’ve updated league data and point tables...',
    content: 'Our app now reflects the latest European league results and current team standings.'
  },
];

const News = () => {
  const [articles, setArticles] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setArticles(fallbackData);
  }, []);

  const toggleReadMore = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="news-wrapper">
      <h2><FaFutbol /> Latest News</h2>
      {articles.map((article) => (
        <div key={article.id} className={`news-article ${expandedId === article.id ? 'expanded' : ''}`}>
          <p className="date">{article.date}</p>
          <h3>{article.title}</h3>
          <p className="content">{expandedId === article.id ? article.content : article.excerpt}</p>
          <button onClick={() => toggleReadMore(article.id)}>
            {expandedId === article.id ? 'Show Less' : 'Read More'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default News;
