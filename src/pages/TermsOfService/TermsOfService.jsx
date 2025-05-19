import React from 'react';
import './TermsOfService.scss'; // jeśli używasz stylów SCSS

const TermsOfService = () => {
  return (
    <div className="tos-container">
      <h1>Terms of Service</h1>
      <p>Last updated: May 9, 2025</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to our football score tracking app ("Service"). By using our Service, you agree to these Terms of Service ("Terms").
          Please read them carefully before using the application.
        </p>
      </section>

      <section>
        <h2>2. Use of the Service</h2>
        <p>
          The Service allows users to view live scores, statistics, and standings from football competitions.
          You agree to use the Service only for lawful purposes and in accordance with these Terms.
        </p>
      </section>

      <section>
        <h2>3. User Accounts</h2>
        <p>
          Some features may require you to register an account. You are responsible for safeguarding your login credentials.
          You agree to provide accurate and complete information when registering.
        </p>
      </section>

      <section>
        <h2>4. Data and Content</h2>
        <p>
          We use third-party data providers for match data, team details, and player statistics. We do not guarantee the accuracy or timeliness of this information.
        </p>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>
        <p>
          All content and intellectual property in the Service, including logos, graphics, and data displays, are owned by us or our licensors.
          You may not reproduce, distribute, or modify any content without permission.
        </p>
      </section>

      <section>
        <h2>6. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the Service at any time if you violate these Terms.
        </p>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          We are not liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the Service.
        </p>
      </section>

      <section>
        <h2>8. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          If you have any questions about these Terms, please contact us at support@scoretracker.com.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
