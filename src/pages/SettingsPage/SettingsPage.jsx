import React, { useEffect, useState } from 'react';
import './SettingsPage.scss';

const SettingsPage = () => {
  const [interfaceMode, setInterfaceMode] = useState('Light');
  const [upcomingNotifications, setUpcomingNotifications] = useState(true);
  const [favoriteNotifications, setFavoriteNotifications] = useState(false);
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <>
      <div className="top">
        <h1>Hi, {username}!</h1>
        <h2>Here you can change your settings!</h2>
      </div>
      <div className="settings">
        <div className="settings-card">
          <h2>Settings</h2>

          <div className="setting-row">
            <div>
              <h3>Interface mode</h3>
              <p>Choose between light or dark theme for the app interface.</p>
            </div>
            <select
              value={interfaceMode}
              onChange={e => setInterfaceMode(e.target.value)}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>

          <div className="setting-row">
            <div>
              <h3>Upcoming matches notifications</h3>
              <p>Receive reminders for upcoming matches!</p>
            </div>
            <button
              className={upcomingNotifications ? 'enabled' : 'disabled'}
              onClick={() => setUpcomingNotifications(prev => !prev)}
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
              onClick={() => setFavoriteNotifications(prev => !prev)}
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
