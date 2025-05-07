import React, { useState } from 'react';
import Matchcard from '../Matchcard/Matchcard';
import './DashboardTabs.scss'

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('live');
  console.log('Aktualna zakładka:', activeTab); // ⬅️ Dodaj to przed return
  return (
    <div className="tabs-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          Live Matches
        </button>
        <button
          className={`tab ${activeTab === 'favourite-players' ? 'active' : ''}`}
          onClick={() => setActiveTab('favourite-players')}
        >
          Favourite players
        </button>
        <button
          className={`tab ${activeTab === 'favourite-teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('favourite-teams')}
        >
          Favourite teams
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'live' && (
          <div className={`tab-pane ${activeTab === 'live' ? 'active' : ''}`}>
            <div className="tab-wrapper">
                <h3 class="tab-header">Live Matches</h3>
                <div className="cards-section">
                    <Matchcard/>
                    <Matchcard/>
                    <Matchcard/>
                    <Matchcard/>
                    <Matchcard/>
                    <Matchcard/>
                    <Matchcard/>
                </div>
            </div>
          </div>
        )}
        {activeTab === 'favourite-players' && (
          <div className={`tab-pane ${activeTab === 'favourite-players' ? 'active' : ''}`}>
            <div className="tab-wrapper">
                <h3 class="tab-header">Favourite players</h3>
                <div className="cards-section">
                    <Matchcard/>
                    <Matchcard/>
                    </div>
            </div>
          </div>
        )}

        {activeTab === 'favourite-teams' && (
          <div className={`tab-pane ${activeTab === 'favourite-teams' ? 'active' : ''}`}>
            <div className="tab-wrapper">
                <h3 class="tab-header">Favourite teams</h3>
                <div className="cards-section">
                    <Matchcard/>
                    <Matchcard/>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTabs;