import React, { useState } from 'react';
import axios from 'axios';

export default function LoginRegister() {
  const [form, setForm] = useState({
    username: '',
    email: '', // Email tylko w formularzu rejestracji
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Stan do przełączania formularzy

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      if (isRegistering) {
        // Formularz rejestracji
        const response = await axios.post('http://localhost:8081/api/auth/register', form);
        setMessage('Rejestracja zakończona sukcesem! Zaloguj się.');
      } else {
        // Formularz logowania
        const response = await axios.post('http://localhost:8081/api/auth/login', form);
        setMessage('Zalogowano pomyślnie!');
        // Możesz tutaj zapisać dane o użytkowniku lub token, jeśli jest używany
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
    <div className="login-wrapper">
      <div style={{ maxWidth: 400, margin: 'auto' }}>
        <h2>{isRegistering ? 'Rejestracja' : 'Logowanie'}</h2>
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
          <br />
          {isRegistering && (
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
          )}
          <br />
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
          <br />
          <button type="submit" disabled={loading}>
            {loading ? (isRegistering ? 'Rejestruję...' : 'Loguję...') : (isRegistering ? 'Zarejestruj się' : 'Zaloguj się')}
          </button>
        </form>
        {message && <p>{message}</p>}
        <button onClick={toggleForm}>
          {isRegistering ? 'Masz konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
        </button>
      </div>
    </div>
  );
}
