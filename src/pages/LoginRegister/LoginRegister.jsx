import React, { useState, useContext } from 'react';
import axios from 'axios';
import './LoginRegister.scss'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

export default function LoginRegister() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext); // <- Użyj login z kontekstu

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      if (isRegistering) {
        await axios.post('http://localhost:8081/api/auth/register', form);
        setMessage('Rejestracja zakończona sukcesem! Zaloguj się.');
      } else {
        const response = await axios.post('http://localhost:8081/api/auth/login', form);
        setMessage('Zalogowano pomyślnie!');

        // Poprawnie wywołaj login z kontekstu (to ustawi user i localStorage)
        login(response.data);

        // Przekieruj
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Wystąpił błąd podczas ' + (isRegistering ? 'rejestracji' : 'logowania') + '.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setMessage('');
    setForm({
      username: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="login-section">
      <div className="login-wrapper">
        <div style={{ maxWidth: 400, margin: 'auto' }}>
          <h4>⚽ ScoreTracker - twój najlepszy asystent 🔥</h4>
          <h2>{isRegistering ? 'Stwórz swoje konto!' : 'Masz konto? Zaloguj się!'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Nazwa użytkownika:
              <input
                type="text"
                name="username"
                minLength={4}
                maxLength={20}
                required
                value={form.username}
                onChange={handleChange}
              />
            </label>
            {isRegistering && (
            <div className="form-group">
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </label>
            </div>
          )}
            <label>
              Hasło:
              <input
                type="password"
                name="password"
                minLength={8}
                required
                value={form.password}
                onChange={handleChange}
              />
            </label>
            <button type="submit" disabled={loading} className='formbutton'>
              {loading
                ? isRegistering
                  ? 'Rejestruję...'
                  : 'Loguję...'
                : isRegistering
                  ? 'Zarejestruj się'
                  : 'Zaloguj się'}
            </button>
          </form>
          {message && <p>{message}</p>}
          <button onClick={toggleForm} className='formbutton register-form-swap-button'>
            {isRegistering ? 'Masz konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
          </button>
        </div>
      </div>
    </div>
  );
}
