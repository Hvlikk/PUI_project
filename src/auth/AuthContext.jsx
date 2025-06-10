import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [username, setUsername] = useState(() => localStorage.getItem('username') || null);
  const [userUuid, setUserUuid] = useState(localStorage.getItem('userUuid') || '');

  const login = (token, userUuid, username) => {
    setToken(token);
    setUsername(username);
    setUserUuid(userUuid);
    localStorage.setItem('token', token);
    localStorage.setItem('userUuid', userUuid)
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setToken(null);
    setUserUuid(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userUuid');
    localStorage.removeItem('username');
  };

  // Przy załadowaniu strony można ewentualnie sprawdzić ważność tokena itp.

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, userUuid, username, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);