import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoritesList from '../../components/FavoritesList/FavoritesList';
import './Favorites.scss';

const Favorites = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddMore = () => {
    if (activeTab === 'teams') {
      navigate('/teams');
    } else {
      navigate('/players');
    }
  };

  return (
    <div className="favorites-container">
          <div className="fav-top">
            <h1>Favorites</h1>
            <h2>Your favorite teams and players!</h2>
          </div>

      <div className="favorites-search">
        <input 
          type="text" 
          placeholder="Type name" 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="favorites-tabs">
        <div className="tab-group">
          <button
            className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => handleTabChange('teams')}
          >
            ⚽ Teams
          </button>
          <button
            className={`tab ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => handleTabChange('players')}
          >
            👤 Players
          </button>
        </div>

        <button
          className="add-more-button"
          onClick={handleAddMore}
        >
          Add more!
        </button>
      </div>

      <div className="tab-content">
        <FavoritesList type={activeTab} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default Favorites;