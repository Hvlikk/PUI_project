// src/App.jsx
import React from 'react';
import './App.css';
import Navbar from './Navbar'; // Importujemy nasz komponent Navbar
import Matchcard from './Matchcard';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App">
      {/* Wyświetlamy nasz pasek nawigacyjny */}
     <Navbar />      
      <div className="content">
       <h1>Witaj w ScoreTracker!</h1>
      </div>
      <Dashboard/>

    </div>
  );
}

export default App;
