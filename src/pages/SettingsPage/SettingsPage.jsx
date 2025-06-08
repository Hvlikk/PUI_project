// SettingsPage.jsx
import React, { useEffect, useState } from 'react';
import './SettingsPage.scss';
import { useTheme } from '../../ThemeContext';

const SettingsPage = () => {
  const [interfaceMode, setInterfaceMode] = useState('Light');
  const [upcomingNotifications, setUpcomingNotifications] = useState(true);
  const [favoriteNotifications, setFavoriteNotifications] = useState(false);
  const [username, setUsername] = useState('User');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { isDarkTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
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
    const savedInterfaceMode = localStorage.getItem('interfaceMode');
    const savedUpcomingNotifications = localStorage.getItem('upcomingNotifications');
    const savedFavoriteNotifications = localStorage.getItem('favoriteNotifications');
    if (savedInterfaceMode) setInterfaceMode(savedInterfaceMode);
    if (savedUpcomingNotifications !== null) setUpcomingNotifications(savedUpcomingNotifications === 'true');
    if (savedFavoriteNotifications !== null) setFavoriteNotifications(savedFavoriteNotifications === 'true');
  };

  const savePreferencesToStorage = (newInterfaceMode, newUpcomingNotifications, newFavoriteNotifications) => {
    localStorage.setItem('interfaceMode', newInterfaceMode);
    localStorage.setItem('upcomingNotifications', newUpcomingNotifications.toString());
    localStorage.setItem('favoriteNotifications', newFavoriteNotifications.toString());
  };

  const fetchPreferences = async (userIdParam) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8081/api/preferences/preferences/${userIdParam}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();

      const newInterfaceMode = data.interfaceMode || 'Light';
      const newUpcomingNotifications = data.upcomingNotifications ?? true;
      const newFavoriteNotifications = data.favoriteNotifications ?? false;

      setInterfaceMode(newInterfaceMode);
      setUpcomingNotifications(newUpcomingNotifications);
      setFavoriteNotifications(newFavoriteNotifications);

      savePreferencesToStorage(newInterfaceMode, newUpcomingNotifications, newFavoriteNotifications);
      setError('');
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Nie udało się pobrać ustawień z serwera. Używam lokalnych ustawień.');
      loadPreferencesFromStorage();
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newInterfaceMode, newUpcomingNotifications, newFavoriteNotifications) => {
    setSaving(true);
    savePreferencesToStorage(newInterfaceMode, newUpcomingNotifications, newFavoriteNotifications);

    const shouldBeDark = newInterfaceMode === 'Dark';
    if (shouldBeDark !== isDarkTheme) toggleTheme();

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
            interfaceMode: newInterfaceMode,
            upcomingNotifications: newUpcomingNotifications,
            favoriteNotifications: newFavoriteNotifications
          }),
        });

        if (!res.ok) throw new Error(`API returned status ${res.status}`);
        setError('');
      } catch (err) {
        console.error('Update failed:', err);
        setError('Ustawienia zapisane lokalnie. Błąd synchronizacji z serwerem.');
      }
    }
    setSaving(false);
  };

  const handleInterfaceModeChange = (e) => {
    const newMode = e.target.value;
    setInterfaceMode(newMode);
    updatePreferences(newMode, upcomingNotifications, favoriteNotifications);
  };

  const handleUpcomingNotificationsToggle = () => {
    const newValue = !upcomingNotifications;
    setUpcomingNotifications(newValue);
    updatePreferences(interfaceMode, newValue, favoriteNotifications);
  };

  const handleFavoriteNotificationsToggle = () => {
    const newValue = !favoriteNotifications;
    setFavoriteNotifications(newValue);
    updatePreferences(interfaceMode, upcomingNotifications, newValue);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}><p>Ładowanie ustawień...</p></div>;
  }

  return (
    <>
      <div className="settings-top">
        <h1>Hi, {username}!</h1>
        <h2>Here you can change your settings!</h2>
      </div>

      {error && (
        <div style={{ textAlign: 'center', margin: '20px auto', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7', borderRadius: '5px', maxWidth: '800px' }}>
          {error}
        </div>
      )}

      <div className="settings">
        <div className="settings-card">
          <h2>Settings {saving && <span style={{ color: '#007bff', fontSize: '14px' }}>(Zapisywanie...)</span>}</h2>

          <div className="setting-row">
            <div>
              <h3>Interface mode</h3>
              <p>Choose between light or dark theme for the app interface.</p>
            </div>
            <select value={interfaceMode} onChange={handleInterfaceModeChange} disabled={saving}>
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>

          <div className="setting-row">
            <div>
              <h3>Upcoming matches notifications</h3>
              <p>Receive reminders for upcoming matches!</p>
            </div>
            <button className={upcomingNotifications ? 'enabled' : 'disabled'} onClick={handleUpcomingNotificationsToggle} disabled={saving}>
              {upcomingNotifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="setting-row">
            <div>
              <h3>Favorite games notifications</h3>
              <p>Stay updated with live scores and results from your favorite matches!</p>
            </div>
            <button className={favoriteNotifications ? 'enabled' : 'disabled'} onClick={handleFavoriteNotificationsToggle} disabled={saving}>
              {favoriteNotifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
