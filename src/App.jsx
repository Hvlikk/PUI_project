import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Footer from './components/Footer/Footer';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

function AppWithRouter() {
  const location = useLocation(); // Hook do pobrania aktualnej lokalizacji
  const isUserPage = location.pathname === '/user'; // <-- to jest potrzebne

  return (
    <div className="App">
      {/* Warunek, który sprawdza, czy aktualna ścieżka to '/user' */}
      {location.pathname !== '/user' && <Navbar />}
        
      <main className={`app-content ${isUserPage ? 'no-navbar-padding' : ''}`}>
        <Routes>
          <Route path='/user' element={<LoginRegister />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path='/contact' element={<Contact />} />
          {/* Dodaj inne ścieżki tutaj */}
          {/* Strona 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
        
      {/* Warunek, który sprawdza, czy aktualna ścieżka to '/user' */}
      {location.pathname !== '/user' && <Footer />}
    </div>
  );
}

export default App;
