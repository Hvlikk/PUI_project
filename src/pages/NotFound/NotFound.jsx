import React from 'react';
import { FaFutbol } from 'react-icons/fa';
import './NotFound.scss'

const NotFound = () => {
  return (
    <div className='nf-wrapper'>
          <FaFutbol className="notfound-icon" />
          <h2>Strona nie znaleziona (404)</h2>
      <p>Przepraszamy, ale nie możemy znaleźć strony, którą szukasz.</p>
    </div>
  );
};

export default NotFound;