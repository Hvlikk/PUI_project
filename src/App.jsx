import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import PrivateRoute from './auth/PrivateRoute';
import ProtectedRoutes from './auth/ProtectedRoutes';
import { AuthProvider } from './auth/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
          <AppWithRouter />
      </AuthProvider>
    </Router>
  );
}

function AppWithRouter() {
  const location = useLocation();
  const isUserPage = location.pathname === '/user';

  return (
    <div className="App">
      {!isUserPage && <Navbar />}

      <main className={`app-content ${isUserPage ? 'no-navbar-padding' : ''}`}>
        <Routes>
          {/* Publiczna trasa logowania/rejestracji */}
          <Route path="/user" element={<LoginRegister />} />

          {/* Wszystkie inne trasy wymagają logowania */}
          <Route
            path="*"
            element={
              <PrivateRoute>
                <ProtectedRoutes />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {!isUserPage && <Footer />}
    </div>
  );
}

export default App;
