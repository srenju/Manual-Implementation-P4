import React, { useState } from 'react';

const API_URL = 'http://localhost:5001/api';

function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data.user, data.token);
      } else {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.map(e => e.msg || e).join(', '));
        } else {
          setError(data.error || 'Login failed');
        }
      }
    } catch (error) {
      setError('Connection error');
    }
  };

  return (
    <div>
      <h1>Article Share - Login</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
        <button type="button" onClick={onSwitchToRegister}>Register</button>
      </form>
    </div>
  );
}

export default Login;

