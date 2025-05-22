import React, { useState, useEffect } from 'react';
import './News.scss';
import { FaFutbol } from 'react-icons/fa';

// Fallback dane – tymczasowe lokalne artykuły
const fallbackData = [
  {
    id: 1,
    date: '2025-05-22',
    title: 'Nowa funkcjonalność: tryb ciemny!',
    excerpt: 'Wprowadziliśmy nowy tryb ciemny dla wygody użytkowników...',
    content: 'W nowej wersji ScoreTracker dodaliśmy możliwość zmiany motywu na ciemny i jasny. Funkcjonalność ta działa globalnie i zapamiętuje preferencje użytkownika.'
  },
  {
    id: 2,
    date: '2025-05-20',
    title: 'Nowości w sekcji „Games”',
    excerpt: 'Sekcja „Games” została rozbudowana o nowe funkcje śledzenia meczów...',
    content: 'Od teraz użytkownicy mogą śledzić mecze w czasie rzeczywistym, z dostępem do statystyk, komentarzy i zmian na boisku.'
  },
  {
    id: 3,
    date: '2025-05-18',
    title: 'Aktualizacja ligi i tabel',
    excerpt: 'Zaktualizowaliśmy dane ligowe oraz tabele punktowe...',
    content: 'Nasza aplikacja uwzględnia teraz wyniki najnowszych kolejek ligowych w Europie oraz aktualne pozycje drużyn.'
  },
];

const News = () => {
  const [articles, setArticles] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Pobieranie z API (tu tylko udajemy, że coś pobieramy)
  useEffect(() => {
    // Tu możesz podmienić URL na swoje API w przyszłości
    // fetch('/api/news')
    //   .then(res => res.json())
    //   .then(data => setArticles(data))
    //   .catch(() => setArticles(fallbackData));

    // Tymczasowo używamy fallbacku
    setArticles(fallbackData);
  }, []);

  const toggleReadMore = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="news-wrapper">
      <h2><FaFutbol /> Najnowsze informacje</h2>
      {articles.map((article) => (
        <div key={article.id} className="news-article">
          <p className="date">{article.date}</p>
          <h3>{article.title}</h3>
          <p>{expandedId === article.id ? article.content : article.excerpt}</p>
          <button onClick={() => toggleReadMore(article.id)}>
            {expandedId === article.id ? 'Show Less' : 'Read More'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default News;
