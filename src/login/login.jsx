import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

import { AuthState } from './authState';

export default function Login({ userName, authState, onAuthChange }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authState === AuthState.Authenticated) {
      // Navigate to CleanMusic page after successful login
      navigate('/cleanmusic', { state: { email } });
    }
  }, [authState, email, navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onAuthChange(email, AuthState.Authenticated, data.token);
        navigate('/cleanmusic', { state: { email } }); // Pass email to CleanMusic
      } else {
        setError('Login failed: Incorrect email or password.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onAuthChange(email, AuthState.Authenticated, data.token);
        navigate('/cleanmusic', { state: { email } }); // Pass email to CleanMusic
      } else if (response.status === 409) {
        setError('Account creation failed: User already exists.');
      } else {
        setError('An error occurred during account creation.');
      }
    } catch (err) {
      setError('An error occurred during account creation.');
    }
  };

  return (
    <main className="container-fluid bg-secondary text-center d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-form">
        {authState !== AuthState.Unknown && <h1>Welcome to Clean Music Plus</h1>}
        
        {authState === AuthState.Authenticated ? (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="get"
          >
            <div className="input-group mb-3">
              <span className="input-group-text">@</span>
              <input
                className="form-control"
                type="text"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">🔒</span>
              <input
                className="form-control"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCreate}>
              Create
            </button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
