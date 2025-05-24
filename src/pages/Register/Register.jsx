import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './Register.scss';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordsMatch(password === passwordConfirm);
  }, [password, passwordConfirm]);

  // Pokazuj popup z błędem przez 3s
  const showErrorPopup = (msg) => {
    setErrorMessage(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      showErrorPopup('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch('http://localhost:8081/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token); // automatyczne logowanie po rejestracji
        navigate('/dashboard');
      } else {
        showErrorPopup(data.message || 'Something went wrong during registration.');
      }
    } catch (error) {
      showErrorPopup('Network or server error');
    }
  };

  return (
  <>
    <div className={`error-popup ${showError ? 'visible' : 'hidden'}`}>
      {errorMessage}
    </div>

    <div className="register-wrapper">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className={passwordsMatch ? '' : 'input-error'}
        />
        {!passwordsMatch && (
          <p className="error-text">Passwords do not match</p>
        )}
        <button type="submit" disabled={!passwordsMatch}>
          Register
        </button>
      </form>
      <p className="redirect-login">
        Already have an account?{' '}
        <a href="/login">Log in</a>
      </p>
    </div>
  </>
  );
};

export default Register;
