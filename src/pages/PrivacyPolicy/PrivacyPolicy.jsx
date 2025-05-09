import React from 'react';
import './PrivacyPolicy.scss';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <h2>Privacy Policy</h2>
      <p>
        Your privacy is important to us. This Privacy Policy explains what data we collect,
        how we use it, and how we protect it.
      </p>
      <h3>Data We Collect</h3>
      <ul>
        <li>Basic user information (e.g., email address, username)</li>
        <li>Usage data (e.g., interaction with app features)</li>
      </ul>
      <h3>How We Use Data</h3>
      <p>
        We use the collected data to improve our services, provide personalized experiences,
        and analyze user behavior within the application.
      </p>
      <p>
        We do not share your personal data with third parties without your explicit consent.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
