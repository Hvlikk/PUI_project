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
import News from './pages/News/News';
import Favorites from './pages/Favorites/Favorites';
import Games from './pages/Games/Games';
import Players from './pages/Players/Players';
import Teams from './pages/Teams/Teams';
import Login from './pages/Login/Login';
import PlayerPage from './components/PlayerPage/PlayerPage';
import Register from './pages/Register/Register'
import SettingsPage from './pages/SettingsPage/SettingsPage';
import TeamPage from './pages/TeamPage/TeamPage';
import PlayerCard from './components/PlayerCard/PlayerCard';
import TeamCard from './components/TeamCard/TeamCard'

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
            <Route path="/faq" element={<FAQ/>}/>
            <Route path="/attributions" element={<Attributions/>}/>
            <Route path="/license" element={<License/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
            <Route path="/news" element={<News/>}/>
            <Route path="/favorites" element={<Favorites/>}/>
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerPage />} />
            <Route path="/teams/:id" element={<TeamPage />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/games" element={<Games />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/settings' element={<SettingsPage/>} />
          </Routes>

        </main>
        <Footer/>
        </Router>
      </div>
    
    
  );
}

export default App;