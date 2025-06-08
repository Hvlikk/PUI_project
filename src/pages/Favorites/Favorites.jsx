import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
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

      <Box className="favorites-search">
        <input 
          type="text" 
          placeholder="Type name" 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Box className="favorites-tabs">
        <ButtonGroup className="tab-buttons">
          <Button
            variant={activeTab === 'teams' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('teams')}
            className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`}
          >
            Teams
          </Button>
          <Button
            variant={activeTab === 'players' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('players')}
            className={`tab-button ${activeTab === 'players' ? 'active' : ''}`}
          >
            Players
          </Button>
        </ButtonGroup>

        <Button
          variant="contained"
          onClick={handleAddMore}
          className="add-more-button"
        >
          Add more!
        </Button>
      </Box>

      <FavoritesList type={activeTab} searchQuery={searchQuery} />
    </div>
  );
};

export default Favorites;