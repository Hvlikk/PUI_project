import React from 'react';
import './Attributions.scss';

const Attributions = () => {
  return (
    <div className="legal-page">
      <h2>Attributions</h2>
      <p>We gratefully acknowledge the use of the following resources and tools:</p>
      <ul>
        <li>
          Football data provided by{' '}
          <a href="https://www.football-data.org/" target="_blank" rel="noopener noreferrer">
            Football-Data.org
          </a>
        </li>
        <li>
          Icons from{' '}
          <a href="https://fontawesome.com/" target="_blank" rel="noopener noreferrer">
            Font Awesome
          </a>
        </li>
        <li>
          UI components by{' '}
          <a href="https://mui.com/" target="_blank" rel="noopener noreferrer">
            Material UI
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Attributions;
