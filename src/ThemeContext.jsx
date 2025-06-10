import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    // Najpierw sprawdź interfaceMode (używany w SettingsPage)
    const interfaceMode = localStorage.getItem('interfaceMode');
    if (interfaceMode) {
      return interfaceMode === 'DARK';
    }
    
    // Jeśli nie ma interfaceMode, sprawdź starą wartość theme
    const stored = localStorage.getItem('theme');
    if (stored) {
      return stored === 'DARK' || stored === 'dark';
    }
    
    // W ostateczności użyj preferencji systemowych
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDarkTheme, setIsDarkTheme] = useState(getInitialTheme);

  // Metoda do ustawiania theme wg wartości 'LIGHT' lub 'DARK'
  const setThemeMode = (mode) => {
    const dark = mode === 'DARK';
    setIsDarkTheme(dark);
    // Zapisz w obu formatach dla kompatybilności
    localStorage.setItem('interfaceMode', mode);
    localStorage.setItem('theme', mode);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    const mode = newTheme ? 'DARK' : 'LIGHT';
    setIsDarkTheme(newTheme);
    // Zapisz w obu formatach dla kompatybilności
    localStorage.setItem('interfaceMode', mode);
    localStorage.setItem('theme', mode);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkTheme);
    document.body.classList.toggle('light-theme', !isDarkTheme);
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);