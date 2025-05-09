import React, { useState } from 'react';
import './FAQ.scss';

const faqData = [
  {
    question: 'Jak działa aplikacja do śledzenia wyników?',
    answer: 'Aplikacja pobiera dane z zewnętrznych źródeł API i prezentuje je w formie meczów na żywo, statystyk i tabel ligowych.',
  },
  {
    question: 'Czy mogę zapisać swoje ulubione drużyny?',
    answer: 'Tak, po zalogowaniu możesz dodać drużyny do ulubionych i śledzić ich wyniki w specjalnej zakładce.',
  },
  {
    question: 'Czy dane meczowe są aktualizowane na żywo?',
    answer: 'Tak, dane są aktualizowane co kilka sekund, aby zapewnić możliwie najnowsze wyniki.',
  },
  {
    question: 'Czy aplikacja jest darmowa?',
    answer: 'Tak, podstawowe funkcjonalności aplikacji są darmowe. Niektóre funkcje premium mogą być płatne w przyszłości.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>Najczęściej zadawane pytania (FAQ)</h1>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggle(index)}>
              {item.question}
              <span className={`arrow ${openIndex === index ? 'open' : ''}`}>&#9662;</span>
            </button>
            <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;