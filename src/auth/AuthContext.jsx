// import React, { createContext, useEffect, useState } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
  

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = (userData) => {
//     localStorage.setItem('user', JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null); // Resetujemy stan użytkownika
//     localStorage.removeItem('user'); // Usuwamy dane użytkownika z localStorage
//     navigate('/user'); // Przekierowujemy na stronę logowania
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

///FOR DEV PURPOSES WITH JWT MOCKUPfdasfasdfasdfasdfasderqggdsffdsgsdfgsdfg
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // WAŻNE: undefined, nie null

  useEffect(() => {
    const loadUser = () => {
      const storedUser = sessionStorage.getItem('user');

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const now = Date.now();

          if (parsed.tokenExpiry && parsed.tokenExpiry > now) {
            setUser(parsed);
          } else {
            sessionStorage.removeItem('user');
            setUser(null);
          }
        } catch (err) {
          console.error('Błąd parsowania usera:', err);
          sessionStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    const tokenExpiry = Date.now() + 1000 * 60 * 60; // 1h
    const userWithToken = { ...userData, token: 'mocked.jwt.token', tokenExpiry };

    sessionStorage.setItem('user', JSON.stringify(userWithToken));
    setUser(userWithToken);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  if (user === undefined) {
    return <div>Ładowanie autoryzacji...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
