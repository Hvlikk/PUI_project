import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
        login(data.token);
        navigate('/dashboard');
      } else {
        showErrorPopup(data.message || 'Something went wrong during registration.');
      }
    } catch (error) {
      showErrorPopup('Network or server error');
    }
  };

  const commonInputSx = {
    backgroundColor: '#264d42',
    borderRadius: '6px',
    '& .MuiFilledInput-root': {
      backgroundColor: '#264d42',
      '&:hover': { backgroundColor: '#2e6d56' },
      '&.Mui-focused': {
        backgroundColor: '#2e6d56',
        boxShadow: '0 0 0 2px #4CAF50',
      },
      // Usunięcie dolnego niebieskiego paska
      '&:before, &:after': {
        borderBottom: 'none',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#ccc',
      // Zapobiega zmianie koloru label na niebieski focus
      '&.Mui-focused': {
        color: '#4CAF50 !important',
      },
    },
    input: {
      color: '#fff',
    },
  };

  return (
    <>
      <div
        className={`error-popup ${showError ? 'visible' : 'hidden'}`}
        style={{
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
        }}
      >
        {errorMessage}
      </div>

      <div
        className="register-wrapper"
        style={{
          maxWidth: 400,
          margin: '6rem auto',
          padding: '2rem',
          background: 'linear-gradient(180deg, #1a3c34, #333)',
          borderRadius: 10,
          color: '#fff',
          fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          position: 'relative',
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="register-form"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700 }}>
            Register
          </h2>

          <TextField
            label="Username"
            variant="filled"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            sx={commonInputSx}
          />

          <TextField
            label="Email"
            type="email"
            variant="filled"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={commonInputSx}
          />

          <TextField
            label="Password"
            type="password"
            variant="filled"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            sx={commonInputSx}
          />

          <TextField
            label="Confirm Password"
            type="password"
            variant="filled"
            fullWidth
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            error={!passwordsMatch}
            helperText={!passwordsMatch ? 'Passwords do not match' : ''}
            sx={commonInputSx}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#4CAF50',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: 1,
              '&:hover': { backgroundColor: '#3a9d38' },
            }}
          >
            Register
          </Button>
        </form>

        <p
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          Have an account?{' '}
          <Link to="/login" style={{ color: '#4CAF50', fontWeight: '600', textDecoration: 'none' }}>
            Log in
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
