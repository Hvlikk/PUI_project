import React, { useEffect, useState } from 'react';
import './SettingsPage.scss';
import { useTheme } from '../../ThemeContext';

const SettingsPage = () => {
  const [interfaceMode, setInterfaceMode] = useState('LIGHT');
  const [upcomingNotifications, setUpcomingNotifications] = useState(true);
  const [favoriteNotifications, setFavoriteNotifications] = useState(false);
  const [username, setUsername] = useState('User');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { isDarkTheme, toggleTheme, setThemeMode } = useTheme();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userUuid');

    if (storedUsername) setUsername(storedUsername);
    if (storedUserId) {
      setUserId(storedUserId);
      fetchPreferences(storedUserId);
    } else {
      loadPreferencesFromStorage();
      setLoading(false);
    }
  }, []);

  const loadPreferencesFromStorage = () => {
    const savedInterfaceMode = localStorage.getItem('interfaceMode') || 'LIGHT';
    const savedUpcoming = localStorage.getItem('upcomingNotifications');
    const savedFavorite = localStorage.getItem('favoriteNotifications');

    setInterfaceMode(savedInterfaceMode);
    if (savedUpcoming !== null) setUpcomingNotifications(savedUpcoming === 'true');
    if (savedFavorite !== null) setFavoriteNotifications(savedFavorite === 'true');

    // Synchronizuj motyw z ThemeContext
    if (setThemeMode) {
      setThemeMode(savedInterfaceMode);
    }
  };

  const savePreferencesToStorage = (mode, upcoming, favorite) => {
    localStorage.setItem('interfaceMode', mode);
    localStorage.setItem('upcomingNotifications', upcoming.toString());
    localStorage.setItem('favoriteNotifications', favorite.toString());
  };

  const fetchPreferences = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8081/api/preferences/preferences/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      // Mapuj wartości z API na format używany w aplikacji
      const mode = data.interfaceMode || data.uiModePreference || 'LIGHT';
      const upcoming = data.upcomingNotifications ?? data.upcomingMatchesNotifications ?? true;
      const favorite = data.favoriteNotifications ?? data.favMatchStartNotifications ?? false;

      setInterfaceMode(mode);
      setUpcomingNotifications(upcoming);
      setFavoriteNotifications(favorite);

      // Synchronizuj motyw z ThemeContext
      if (setThemeMode) {
        setThemeMode(mode);
      }

      savePreferencesToStorage(mode, upcoming, favorite);
      setError('');
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setError('Nie udało się pobrać ustawień z serwera. Używam lokalnych ustawień.');
      loadPreferencesFromStorage();
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (mode, upcoming, favorite) => {
    setSaving(true);
    
    // Zapisz lokalnie
    savePreferencesToStorage(mode, upcoming, favorite);
    
    // Synchronizuj motyw z ThemeContext
    if (setThemeMode) {
      setThemeMode(mode);
    }

    // Jeśli użytkownik jest zalogowany, wyślij na serwer
    if (userId) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8081/api/preferences/preferences/${userId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userUUID: userId,
            uiModePreference: mode,
            upcomingMatchesNotifications: upcoming,
            favMatchStartNotifications: favorite,
          }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        setError('');
      } catch (err) {
        console.error('Error saving preferences:', err);
        setError('Ustawienia zapisane lokalnie. Błąd synchronizacji z serwerem.');
      }
    }

    setSaving(false);
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setInterfaceMode(newMode);
    updatePreferences(newMode, upcomingNotifications, favoriteNotifications);
  };

  const handleToggle = (key) => {
    if (key === 'upcomingNotifications') {
      const newValue = !upcomingNotifications;
      setUpcomingNotifications(newValue);
      updatePreferences(interfaceMode, newValue, favoriteNotifications);
    } else if (key === 'favoriteNotifications') {
      const newValue = !favoriteNotifications;
      setFavoriteNotifications(newValue);
      updatePreferences(interfaceMode, upcomingNotifications, newValue);
    }
  };

  if (loading) {
    return <div className="loading">Ładowanie ustawień...</div>;
  }

  return (
    <>
      <div className="settings-top">
        <h1>Hi, {username}!</h1>
        <h2>Here you can change your settings!</h2>
      </div>

      {error && (
        <div className="settings-error">
          {error}
        </div>
      )}

      <div className="settings">
        <div className="settings-card">
          <h2>
            Settings {saving && <span className="saving-status">(Zapisywanie...)</span>}
          </h2>

          <div className="setting-row">
            <div>
              <h3>Interface mode</h3>
              <p>Choose between light or dark theme for the app interface.</p>
            </div>
            <select value={interfaceMode} onChange={handleModeChange} disabled={saving}>
              <option value="LIGHT">LIGHT</option>
              <option value="DARK">DARK</option>
            </select>
          </div>

          <div className="setting-row">
            <div>
              <h3>Upcoming matches notifications</h3>
              <p>Receive reminders for upcoming matches!</p>
            </div>
            <button
              className={upcomingNotifications ? 'enabled' : 'disabled'}
              onClick={() => handleToggle('upcomingNotifications')}
              disabled={saving}
            >
              {upcomingNotifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="setting-row">
            <div>
              <h3>Favorite games notifications</h3>
              <p>Stay updated with live scores and results from your favorite matches!</p>
            </div>
            <button
              className={favoriteNotifications ? 'enabled' : 'disabled'}
              onClick={() => handleToggle('favoriteNotifications')}
              disabled={saving}
            >
              {favoriteNotifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;