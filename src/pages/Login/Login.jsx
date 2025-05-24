import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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

  useEffect(() => {
    if (error) {
      setShowError(true);
      const fadeOutTimer = setTimeout(() => setShowError(false), 2500);
      const removeTimer = setTimeout(() => setError(''), 3000);
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
    <div className="login-wrapper" style={{ maxWidth: 400, margin: '6rem auto', padding: '2rem', backgroundColor: 'rgba(26,60,52,0.9)', borderRadius: 10, color: '#fff', fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', position: 'relative' }}>
      {error && (
        <div className={`error-popup ${showError ? 'visible' : 'hidden'}`} style={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 80, 80, 0.9)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 6,
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 10000,
          opacity: showError ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: showError ? 'auto' : 'none',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700 }}>Login</h2>

        <TextField
          label="Username"
          variant="filled"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          sx={{
            backgroundColor: '#264d42',
            borderRadius: '6px',
            '& .MuiFilledInput-root': {
              backgroundColor: '#264d42',
              '&:hover': { backgroundColor: '#2e6d56' },
              '&.Mui-focused': {
                backgroundColor: '#2e6d56',
                boxShadow: '0 0 0 2px #4CAF50',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#4CAF50 !important',
            },
            input: {
              color: '#fff',
            },
            '& .MuiFilledInput-underline:after': {
              borderBottomColor: '#4CAF50',
            },
            '& .MuiFilledInput-underline:before': {
              borderBottomColor: 'transparent',
            },
            '&:hover .MuiFilledInput-underline:before': {
              borderBottomColor: '#2e6d56',
            },
          }}
        />

        <TextField
          label="Password"
          type="password"
          variant="filled"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          sx={{
            backgroundColor: '#264d42',
            borderRadius: '6px',
            '& .MuiFilledInput-root': {
              backgroundColor: '#264d42',
              '&:hover': { backgroundColor: '#2e6d56' },
              '&.Mui-focused': {
                backgroundColor: '#2e6d56',
                boxShadow: '0 0 0 2px #4CAF50',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ccc',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#4CAF50 !important',
            },
            input: {
              color: '#fff',
            },
            '& .MuiFilledInput-underline:after': {
              borderBottomColor: '#4CAF50',
            },
            '& .MuiFilledInput-underline:before': {
              borderBottomColor: 'transparent',
            },
            '&:hover .MuiFilledInput-underline:before': {
              borderBottomColor: '#2e6d56',
            },
          }}
        />

        <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#4CAF50', textDecoration: 'none', alignSelf: 'flex-end', marginTop: '-0.5rem', marginBottom: '1rem', fontWeight: 600 }} onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>
          Forgot password?
        </Link>

        <Button type="submit" variant="contained" sx={{ backgroundColor: '#4CAF50', fontWeight: 600, fontSize: '1rem', padding: '0.75rem 1rem', borderRadius: 1, '&:hover': { backgroundColor: '#3a9d38' } }}>
          Log in
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#4CAF50', fontWeight: 600, textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
