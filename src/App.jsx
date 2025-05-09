import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Footer from './components/Footer/Footer'
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import StatisticsPage from './pages/StatisticsPage/StatisticsPage';
import StandingsPage from './pages/StandingsPage/StandingsPage';
import NotFound from './pages/NotFound/NotFound';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import FAQ from './pages/FAQ/FAQ';
import Attributions from './pages/Attributions/Attributions';
import License from './pages/License/License';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';

function App() {
  return (
      <div className="App">
        <Router>
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/about" element={<About />} />
            <Route path='/contact' element={<Contact/>}/>
            <Route path="/standings/:leagueId" element={<StandingsPage />} />
            <Route path="/statistics/:leagueId" element={<StatisticsPage />} />
            <Route path="/tos" element={<TermsOfService/>}/>
            <Route path="/attributions" element={<Attributions/>}/>
            <Route path="/license" element={<License/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>

            
            {/* Dodaj tutaj inne ścieżki */}
          </Routes>

        </main>
        <Footer/>
        </Router>
      </div>
    
    
  );
}

export default App;