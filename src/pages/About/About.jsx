import React from "react";
import './About.scss';

const team = [
  { name: 'Miłosz', role: 'Frontend Developer', team: 'XD', fact: 'Kocham Reacta' },
  { name: 'Filip', role: 'Frontend Developer', team: 'Barcelona', fact: 'Zawsze gotowy do kodu' },
  { name: 'Kuba', role: 'Backend Developer', team: 'Manchester United', fact: 'C# to moje życie' },
  { name: 'Igor', role: 'Backend Developer', team: 'Bayern Monachium', fact: 'Zrobi backend z zamkniętymi oczami' },
];

function About() {
  return (
    <div className="about-us-content">
      <div className="story-container">
        <div className="text">Marzec 2025</div>
        <div className="text">4 studentów z pasją...</div>
        <div className="text">Wspólny projekt...</div>
        <div className="text">ScoreTracker - z miłości do ⚽</div>
      </div>

      <div className="about-us-persons-container">
        {team.map(({ name, role, team, fact }, i) => (
          <div key={i} className="person">
            <div className="photo">
              <img src="src/assets/placeholder.png" alt={`${name}'s photo`} className="team-photo" />
            </div>
            <div className="facts">
              <h2>{name}</h2>
              <h3>{role}</h3>
              <h3>Fav Team: {team}</h3>
              <p>{fact}</p>
              <p>Kontakt: will be updated</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
