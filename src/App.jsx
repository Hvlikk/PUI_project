// src/App.jsx
import React from 'react';
import './App.css';
import Navbar from './Navbar'; // Importujemy nasz komponent Navbar

function App() {
  return (
    <div className="App">
      {/* Wyświetlamy nasz pasek nawigacyjny */}
      <Navbar />

      <div className="content">
        <h1>Witaj w ScoreTracker!</h1>
      </div>
    </div>
  );
}

export default App;
