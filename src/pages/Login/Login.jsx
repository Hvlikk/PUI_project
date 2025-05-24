import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './Login.scss';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  // Obsługa błędu z animacją fade out
  useEffect(() => {
    if (error) {
      setShowError(true);

      const fadeOutTimer = setTimeout(() => {
        setShowError(false);
      }, 2500); // fade out start after 2.5s

      const removeTimer = setTimeout(() => {
        setError('');
      }, 3000); // remove error after 3s

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.jwtToken, data.username);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid login credentials');
      }
    } catch (error) {
      setError('Network or server error');
    }
  };

  return (
    <div className="login-wrapper">
      {error && (
        <div className={`error-popup ${showError ? 'visible' : 'hidden'}`}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link to="/forgot-password" className="forgot-password">
          Forgot password?
        </Link>
        <button type="submit">Log in</button>
      </form>
      <p className="register-text">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
