import React, { useState } from "react";
import './Contact.scss';

function Contact() {
  // Stan motywu: false = jasny, true = ciemny
  const [darkMode, setDarkMode] = useState(false);

  // Funkcja przełączająca motyw
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={darkMode ? "wrapper dark-theme" : "wrapper"}>
      <button 
        onClick={toggleDarkMode} 
        style={{
          position: 'fixed', 
          top: 10, 
          right: 10, 
          padding: '0.5rem 1rem', 
          zIndex: 1000,
          cursor: 'pointer'
        }}
      >
        {darkMode ? "Jasny motyw" : "Ciemny motyw"}
      </button>

      <div className="content-wrapper">
        <div className="left-col-wrapper">
          <div className="col left">
            <h1>☎️ Skontaktuj się z nami!</h1>
            <p>Masz pytania, sugestie lub chcesz zgłosić błąd? Jesteśmy otwarci na Twoją opinię! Aplikacja ScoreTracker powstała z pasji do sportu i technologii, dlatego każdy feedback pomaga nam tworzyć jeszcze lepsze doświadczenie dla fanów sportu.</p>
            <h1>📧 Napisz do nas</h1>
            <p><strong>Email: contact@scoretracker.app</strong></p>
            <p>Telefon: +48 123 456 789 (pon.–pt. 9:00–17:00)</p>
            <h1>🛠 Zgłoś problem techniczny</h1>
            <p>Jeśli napotkałeś problemy w działaniu aplikacji lub masz pytania techniczne, odwiedź naszą stronę pomocy lub napisz bezpośrednio na: <strong>support@scoretracker.app</strong></p>
            <h1>🤝 Współpraca i partnerstwa</h1>
            <p>Chcesz współpracować, zintegrować swoje API z naszą aplikacją lub masz pomysł na rozwój ScoreTrackera? Skontaktuj się: <strong>partnerships@scoretracker.app</strong></p>
            <h1>💡 Społeczność i rozwój</h1>
            <p>Dołącz do społeczności ScoreTrackera, zgłaszaj pomysły i głosuj na nowe funkcje: Link</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
